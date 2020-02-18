import { obx, autorun, computed } from '@recore/obx';
import { ISimulator, ComponentInstance, Component, NodeInstance } from '../../../designer/simulator';
import Viewport from './viewport';
import { createSimulator } from './create-simulator';
import { SimulatorRenderer } from '../renderer/renderer';
import Node, { NodeParent } from '../../../designer/document/node/node';
import DocumentModel from '../../../designer/document/document-model';
import ResourceConsumer from './resource-consumer';
import { AssetLevel, Asset, assetBundle, assetItem, AssetType } from '../utils/asset';
import { DragObjectType, isShaken, LocateEvent, DragNodeObject, DragNodeDataObject } from '../../../designer/helper/dragon';
import { LocationData } from '../../../designer/helper/location';
import { NodeData } from '../../../designer/schema';
import { ComponentDescriptionSpec } from '../../../designer/component-config';
import { ReactInstance } from 'react';
import { setNativeSelection } from '../../../utils/navtive-selection';
import cursor from '../../../designer/helper/cursor';

export interface SimulatorProps {
  // 从 documentModel 上获取
  // suspended?: boolean;
  designMode?: 'live' | 'design' | 'mock' | 'extend' | 'border' | 'preview';
  device?: 'mobile' | 'iphone' | string;
  deviceClassName?: string;
  simulatorUrl?: Asset;
  dependsAsset?: Asset;
  themesAsset?: Asset;
  componentsAsset?: Asset;
  [key: string]: any;
}

const publicPath = (document.currentScript as HTMLScriptElement).src.replace(/^(.*\/)[^/]+$/, '$1');

const defaultSimulatorUrl = (() => {
  let urls;
  if (process.env.NODE_ENV === 'production') {
    urls = [`${publicPath}simulator-renderer.min.css`, `${publicPath}simulator-renderer.min.js`];
  } else {
    urls = [`${publicPath}simulator-renderer.css`, `${publicPath}simulator-renderer.js`];
  }
  return urls;
})();

const defaultDepends = [
  // https://g.alicdn.com/mylib/??react/16.11.0/umd/react.production.min.js,react-dom/16.8.6/umd/react-dom.production.min.js,prop-types/15.7.2/prop-types.min.js
  assetItem(AssetType.JSText, 'window.React=parent.React;window.ReactDOM=parent.ReactDOM;', undefined, 'react'),
  assetItem(
    AssetType.JSText,
    'window.PropTypes=parent.PropTypes;React.PropTypes=parent.PropTypes; window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;',
  ),
  assetItem(AssetType.JSUrl, 'https://g.alicdn.com/mylib/@ali/recore/1.5.7/umd/recore.min.js'),
  assetItem(AssetType.JSUrl, 'http://localhost:4444/js/index.js'),
];

export class SimulatorHost implements ISimulator<SimulatorProps> {
  readonly isSimulator = true;
  constructor(readonly document: DocumentModel) {}

  readonly designer = this.document.designer;

  private _sensorAvailable: boolean = true;
  get sensorAvailable(): boolean {
    return this._sensorAvailable;
  }

  @computed get device(): string | undefined {
    // 根据 device 不同来做画布外框样式变化  渲染时可选择不同组件
    // renderer 依赖
    return this.get('device');
  }

  @computed get deviceClassName(): string | undefined {
    return this.get('deviceClassName');
  }

  @computed get designMode(): 'live' | 'design' | 'extend' | 'border' | 'preview' {
    // renderer 依赖
    // TODO: 需要根据 design mode 不同切换鼠标响应情况
    return this.get('designMode') || 'design';
  }

  @computed get componentsAsset(): Asset | undefined {
    return this.get('componentsAsset');
  }

  @computed get themesAsset(): Asset | undefined {
    return this.get('themesAsset');
  }

  @computed get componentsMap() {
    // renderer 依赖
    return this.designer.componentsMap;
  }

  @obx.ref _props: SimulatorProps = {};
  setProps(props: SimulatorProps) {
    this._props = props;
  }
  set(key: string, value: any) {
    this._props = {
      ...this._props,
      [key]: value,
    };
  }
  get(key: string): any {
    return this._props[key];
  }

  /**
   * 有 Renderer 进程连接进来，设置同步机制
   */
  connect(renderer: SimulatorRenderer, fn: (context: { dispose: () => void; firstRun: boolean }) => void) {
    this._renderer = renderer;
    return autorun(fn as any, true);
  }

  purge(): void {}

  readonly viewport = new Viewport();
  readonly scroller = this.designer.createScroller(this.viewport);

  mountViewport(viewport: Element | null) {
    if (!viewport) {
      return;
    }
    this.viewport.mount(viewport);
  }

  @obx.ref private _contentWindow?: Window;
  get contentWindow() {
    return this._contentWindow;
  }

  @obx.ref private _contentDocument?: Document;
  get contentDocument() {
    return this._contentDocument;
  }

  private _renderer?: SimulatorRenderer;
  get renderer() {
    return this._renderer;
  }

  readonly componentsConsumer = new ResourceConsumer<Asset | undefined>(() => this.componentsAsset);

  readonly injectionConsumer = new ResourceConsumer(() => {
    return {};
  });

  async mountContentFrame(iframe: HTMLIFrameElement | null) {
    if (!iframe) {
      return;
    }

    this._contentWindow = iframe.contentWindow!;

    const vendors = [
      // required & use once
      assetBundle(this.get('dependsAsset') || defaultDepends, AssetLevel.BaseDepends),
      // required & TODO: think of update
      assetBundle(this.themesAsset, AssetLevel.Theme),
      // required & use once
      assetBundle(this.get('simulatorUrl') || defaultSimulatorUrl, AssetLevel.Runtime),
    ];

    // wait 准备 iframe 内容、依赖库注入
    const renderer = await createSimulator(this, iframe, vendors);

    // wait 业务组件被第一次消费，否则会渲染出错
    await this.componentsConsumer.waitFirstConsume();

    // wait 运行时上下文
    await this.injectionConsumer.waitFirstConsume();

    // step 5 ready & render
    renderer.run();

    // init events, overlays
    this._contentDocument = this._contentWindow.document;
    this.viewport.setScrollTarget(this._contentWindow);
    this.setupEvents();
    // hotkey.mount(this.contentWindow);
    // clipboard.injectCopyPaster(this.ownerDocument);
  }

  setupEvents() {
    this.setupDragAndClick();
    this.setupHovering();
  }

  setupDragAndClick() {
    const documentModel = this.document;
    const selection = documentModel.selection;
    const designer = documentModel.designer;
    const doc = this.contentDocument!;

    // TODO: think of lock when edit a node
    // 事件路由
    doc.addEventListener('mousedown', (downEvent: MouseEvent) => {
      const nodeInst = documentModel.getNodeInstanceFromElement(downEvent.target as Element);
      if (!nodeInst?.node) {
        selection.clear();
        return;
      }

      const isMulti = downEvent.metaKey || downEvent.ctrlKey;
      const isLeftButton = downEvent.which === 1 || downEvent.button === 0;

      if (isLeftButton) {
        let node: Node = nodeInst.node;
        let nodes: Node[] = [node];
        let ignoreUpSelected = false;
        if (isMulti) {
          // multi select mode, directily add
          if (!selection.has(node.id)) {
            designer.activeTracker.track(node);
            selection.add(node.id);
            ignoreUpSelected = true;
          }
          // 获得顶层 nodes
          nodes = selection.getTopNodes();
        } else if (selection.containsNode(node)) {
          nodes = selection.getTopNodes();
        } else {
          // will clear current selection & select dragment in dragstart
        }
        designer.dragon.boost(
          {
            type: DragObjectType.Node,
            nodes,
          },
          downEvent,
        );
        if (ignoreUpSelected) {
          // multi select mode has add selected, should return
          return;
        }
      }

      const checkSelect = (e: MouseEvent) => {
        doc.removeEventListener('mouseup', checkSelect, true);
        if (!isShaken(downEvent, e)) {
          // const node = hasConditionFlow(target) ? target.conditionFlow : target;
          const node = nodeInst.node!;
          const id = node.id;
          designer.activeTracker.track(node);
          if (isMulti && selection.has(id)) {
            selection.remove(id);
          } else {
            selection.select(id);
          }
        }
      };
      doc.addEventListener('mouseup', checkSelect, true);
    });

    // cause edit
    doc.addEventListener('dblclick', (e: MouseEvent) => {
      // TODO:

    });
  }

  private disableHovering?: () => void;
  /**
   * 设置悬停处理
   */
  setupHovering() {
    const doc = this.contentDocument!;
    const hovering = this.document.designer.hovering;
    const hover = (e: MouseEvent) => {
      if (!hovering.enable) {
        return;
      }
      const nodeInst = this.document.getNodeInstanceFromElement(e.target as Element);
      // TODO: enhance only hover one instance
      hovering.hover(nodeInst?.node || null);
      e.stopPropagation();
    };
    const leave = () => hovering.leave(this.document);

    doc.addEventListener('mouseover', hover, true);
    doc.addEventListener('mouseleave', leave, false);

    // TODO: refactor this line, contains click, mousedown, mousemove
    doc.addEventListener(
      'mousemove',
      (e: Event) => {
        e.stopPropagation();
      },
      true,
    );

    this.disableHovering = () => {
      hovering.leave(this.document);
      doc.removeEventListener('mouseover', hover, true);
      doc.removeEventListener('mouseleave', leave, false);
      this.disableHovering = undefined;
    };
  }

  setSuspense(suspended: boolean) {
    if (suspended) {
      if (this.disableHovering) {
        this.disableHovering();
      }
      // sleep some autorun reaction
    } else {
      // weekup some autorun reaction
      if (!this.disableHovering) {
        this.setupHovering();
      }
    }
  }

  setDesignMode(mode: string): void {
    throw new Error('Method not implemented.');
  }

  describeComponent(component: Component): ComponentDescriptionSpec {
    throw new Error('Method not implemented.');
  }

  getComponent(componentName: string): Component {
    throw new Error('Method not implemented.');
  }

  getComponentInstance(node: Node): ReactInstance[] | null {
    return this._renderer?.getComponentInstance(node.id) || null;
  }

  getComponentInstanceId(instance: ReactInstance) {

  }

  getComponentContext(node: Node): object {
    throw new Error('Method not implemented.');
  }

  getClosestNodeInstance(elem: Element): NodeInstance | null {
    return this.renderer?.getClosestNodeInstance(elem) || null;
  }

  computeComponentInstanceRect(instance: ReactInstance): DOMRect | null {
    const renderer = this.renderer!;
    const elements = renderer.findDOMNodes(instance);
    if (!elements) {
      return null;
    }

    let rects: DOMRect[] | undefined;
    let last: { x: number; y: number; r: number; b: number; } | undefined;
    while (true) {
      if (!rects || rects.length < 1) {
        const elem = elements.pop();
        if (!elem) {
          break;
        }
        rects = renderer.getClientRects(elem);
      }
      const rect = rects.pop();
      if (!rect) {
        break;
      }
      if (!last) {
        last = {
          x: rect.left,
          y: rect.top,
          r: rect.right,
          b: rect.bottom,
        };
        continue;
      }
      if (rect.left < last.x) {
        last.x = rect.left;
      }
      if (rect.top < last.y) {
        last.y = rect.top;
      }
      if (rect.right > last.r) {
        last.r = rect.right;
      }
      if (rect.bottom > last.b) {
        last.b = rect.bottom;
      }
    }

    if (last) {
      return new DOMRect(last.x, last.y, last.r - last.x, last.b - last.y);
    }

    return null;
  }

  findDOMNodes(instance: ReactInstance): Array<Element | Text> | null {
    return this._renderer?.findDOMNodes(instance) || null;
  }

  private tryScrollAgain: number | null = null;
  scrollToNode(node: Node, detail?: any, tryTimes = 0) {
    this.tryScrollAgain = null;
    if (this.sensing) {
      // actived sensor
      return;
    }

    const opt: any = {};
    let scroll = false;

    if (detail) {
      // TODO:
      /*
      const rect = insertion ? insertion.getNearRect() : node.getRect();
      let y;
      let scroll = false;
      if (insertion && rect) {
        y = insertion.isNearAfter() ? rect.bottom : rect.top;

        if (y < bounds.top || y > bounds.bottom) {
          scroll = true;
        }
      }*/
    } else {
      /*
      const rect = this.document.computeRect(node);
      if (!rect || rect.width === 0 || rect.height === 0) {
        if (!this.tryScrollAgain && tryTimes < 3) {
          this.tryScrollAgain = requestAnimationFrame(() => this.scrollToNode(node, null, tryTimes + 1));
        }
        return;
      }
      const scrollTarget = this.viewport.scrollTarget!;
      const st = scrollTarget.top;
      const sl = scrollTarget.left;
      const { scrollHeight, scrollWidth } = scrollTarget;
      const { height, width, top, bottom, left, right } = this.viewport.contentBounds;

      if (rect.height > height ? rect.top > bottom || rect.bottom < top : rect.top < top || rect.bottom > bottom) {
        opt.top = Math.min(rect.top + rect.height / 2 + st - top - height / 2, scrollHeight - height);
        scroll = true;
      }

      if (rect.width > width ? rect.left > right || rect.right < left : rect.left < left || rect.right > right) {
        opt.left = Math.min(rect.left + rect.width / 2 + sl - left - width / 2, scrollWidth - width);
        scroll = true;
      }*/
    }

    if (scroll && this.scroller) {
      this.scroller.scrollTo(opt);
    }
  }

  // #region ========= drag and drop helpers =============
  setNativeSelection(enableFlag: boolean) {
    setNativeSelection(enableFlag);
  }
  setDraggingState(state: boolean) {
    cursor.setDragging(state);
  }
  setCopyState(state: boolean) {
    cursor.setCopy(state);
  }
  clearState() {
    cursor.release();
  }

  fixEvent(e: LocateEvent): LocateEvent {
    /*
    if (e.fixed) {
      return e;
    }
    if (!e.target || e.originalEvent.view!.document !== this.contentDocument) {
      e.target = this.contentDocument!.elementFromPoint(e.canvasX, e.canvasY);
    }*/
    return e;
  }

  isEnter(e: LocateEvent): boolean {
    return false; /*
    const rect = this.bounds;
    return e.globalY >= rect.top && e.globalY <= rect.bottom && e.globalX >= rect.left && e.globalX <= rect.right;
    */
  }

  private sensing: boolean = false;
  deactiveSensor() {
    this.sensing = false;
    this.scroller.cancel();
  }

  // ========= drag location logic start ==========
  getDropTarget(e: LocateEvent): NodeParent | LocationData | null {
    /*
    const { target, dragTarget } = e;
    const isAny = isAnyDragTarget(dragTarget);
    let container: any;
    if (target) {
      const ref = this.document.getNodeFromElement(target as Element);
      if (ref) {
        container = ref;
      } else if (isAny) {
        return null;
      } else {
        container = this.document.view;
      }
    } else if (isAny) {
      return null;
    } else {
      container = this.document.view;
    }

    if (!isElementNode(container) && !isRootNode(container)) {
      container = container.parent;
    }

    // use spec container to accept specialData
    if (isAny) {
      while (container) {
        if (isRootNode(container)) {
          return null;
        }
        const locationData = this.acceptAnyData(container, e);
        if (locationData) {
          return locationData;
        }
        container = container.parent;
      }
      return null;
    }

    let res: any;
    let upward: any;
    // TODO: improve AT_CHILD logic, mark has checked
    while (container) {
      res = this.acceptNodes(container, e);
      if (isLocationData(res)) {
        return res;
      }
      if (res === true) {
        return container;
      }
      if (!res) {
        if (upward) {
          container = upward;
          upward = null;
        } else {
          container = container.parent;
        }
      } else if (res === AT_CHILD) {
        if (!upward) {
          upward = container.parent;
        }
        container = this.getNearByContainer(container, e);
        if (!container) {
          container = upward;
          upward = null;
        }
      } else if (isNode(res)) {
        container = res;
        upward = null;
      }
    }*/
    return null;
  }

  acceptNodes(container: Node, e: LocateEvent) {
    /*
    const { dragTarget } = e;
    if (isRootNode(container)) {
      return this.checkDropTarget(container, dragTarget as any);
    }

    const proto = container.prototype;

    const acceptable: boolean = this.isAcceptable(container);
    if (!proto.isContainer && !acceptable) {
      return false;
    }

    // check is contains, get common parent
    if (isNodesDragTarget(dragTarget)) {
      const nodes = dragTarget.nodes;
      let i = nodes.length;
      let p: any = container;
      while (i-- > 0) {
        if (contains(nodes[i], p)) {
          p = nodes[i].parent;
        }
      }
      if (p !== container) {
        return p || this.document.view;
      }
    }

    // first use accept
    if (acceptable) {
      const view: any = this.document.getView(container);
      if (view && '$accept' in view) {
        if (view.$accept === false) {
          return false;
        }
        if (view.$accept === AT_CHILD || view.$accept === '@CHILD') {
          return AT_CHILD;
        }
        if (typeof view.$accept === 'function') {
          const ret = view.$accept(container, e);
          if (ret || ret === false) {
            return ret;
          }
        }
      }
      if (proto.acceptable) {
        const ret = proto.accept(container, e);
        if (ret || ret === false) {
          return ret;
        }
      }
    }

    return this.checkNesting(container, dragTarget as any);
    */
  }

  getNearByContainer(container: NodeParent, e: LocateEvent) {
    /*
    const children = container.children;
    if (!children || children.length < 1) {
      return null;
    }

    let nearDistance: any = null;
    let nearBy: any = null;
    for (let i = 0, l = children.length; i < l; i++) {
      let child: any = children[i];
      if (!isElementNode(child)) {
        continue;
      }
      if (hasConditionFlow(child)) {
        const bn = child.conditionFlow;
        i = bn.index + bn.length - 1;
        child = bn.visibleNode;
      }
      const rect = this.document.computeRect(child);
      if (!rect) {
        continue;
      }

      if (isPointInRect(e, rect)) {
        return child;
      }

      const distance = distanceToRect(e, rect);
      if (nearDistance === null || distance < nearDistance) {
        nearDistance = distance;
        nearBy = child;
      }
    }

    return nearBy;*/
  }

  locate(e: LocateEvent): any {
    /*
    this.sensing = true;
    this.scroller.scrolling(e);
    const dropTarget = this.getDropTarget(e);
    if (!dropTarget) {
      return null;
    }

    if (isLocationData(dropTarget)) {
      return this.document.createLocation(dropTarget);
    }

    const target = dropTarget;

    const edge = this.document.computeRect(target);

    const children = target.children;

    const detail: LocationChildrenDetail = {
      type: LocationDetailType.Children,
      index: 0,
    };

    const locationData = {
      target,
      detail,
    };

    if (!children || children.length < 1 || !edge) {
      return this.document.createLocation(locationData);
    }

    let nearRect = null;
    let nearIndex = 0;
    let nearNode = null;
    let nearDistance = null;
    let top = null;
    let bottom = null;

    for (let i = 0, l = children.length; i < l; i++) {
      let node = children[i];
      let index = i;
      if (hasConditionFlow(node)) {
        node = node.conditionFlow;
        index = node.index;
        // skip flow items
        i = index + (node as any).length - 1;
      }
      const rect = this.document.computeRect(node);

      if (!rect) {
        continue;
      }

      const distance = isPointInRect(e, rect) ? 0 : distanceToRect(e, rect);

      if (distance === 0) {
        nearDistance = distance;
        nearNode = node;
        nearIndex = index;
        nearRect = rect;
        break;
      }

      // TODO: 忘记为什么这么处理了，记得添加注释
      if (top === null || rect.top < top) {
        top = rect.top;
      }
      if (bottom === null || rect.bottom > bottom) {
        bottom = rect.bottom;
      }

      if (nearDistance === null || distance < nearDistance) {
        nearDistance = distance;
        nearNode = node;
        nearIndex = index;
        nearRect = rect;
      }
    }

    detail.index = nearIndex;

    if (nearNode && nearRect) {
      const el = getRectTarget(nearRect);
      const inline = el ? isChildInline(el) : false;
      const row = el ? isRowContainer(el.parentElement!) : false;
      const vertical = inline || row;
      // TODO: fix type
      const near: any = {
        node: nearNode,
        pos: 'before',
        align: vertical ? 'V' : 'H',
      };
      detail.near = near;
      if (isNearAfter(e, nearRect, vertical)) {
        near.pos = 'after';
        detail.index = nearIndex + (isConditionFlow(nearNode) ? nearNode.length : 1);
      }
      if (!row && nearDistance !== 0) {
        const edgeDistance = distanceToEdge(e, edge);
        if (edgeDistance.distance < nearDistance!) {
          const nearAfter = edgeDistance.nearAfter;
          if (top == null) {
            top = edge.top;
          }
          if (bottom == null) {
            bottom = edge.bottom;
          }
          near.rect = new DOMRect(edge.left, top, edge.width, bottom - top);
          near.align = 'H';
          near.pos = nearAfter ? 'after' : 'before';
          detail.index = nearAfter ? children.length : 0;
        }
      }
    }

    return this.document.createLocation(locationData);
    */
  }

  isAcceptable(container: NodeParent): boolean {
    return false;
    /*
    const proto = container.prototype;
    const view: any = this.getComponentInstance(container);
    if (view && '$accept' in view) {
      return true;
    }
    return proto.acceptable;*/
  }

  acceptAnyData(container: Node, e: LocateEvent | MouseEvent | KeyboardEvent) {
    /*
    const proto = container.prototype;
    const view: any = this.document.getView(container);
    // use view instance method: $accept
    if (view && typeof view.$accept === 'function') {
      // should return LocationData
      return view.$accept(container, e);
    }
    // use prototype method: accept
    return proto.accept(container, e);*/
  }

  checkNesting(dropTarget: Node, dragTarget: DragNodeObject | DragNodeDataObject): boolean {
    return false;
    /*
    const items: Array<INode | NodeData> = dragTarget.nodes || (dragTarget as NodeDatasDragTarget).data;
    return items.every(item => this.checkNestingDown(dropTarget, item));
    */
  }

  checkDropTarget(dropTarget: Node, dragTarget: DragNodeObject | DragNodeDataObject): boolean {
    return false;
    /*
    const items: Array<INode | NodeData> = dragTarget.nodes || (dragTarget as NodeDatasDragTarget).data;
    return items.every(item => this.checkNestingUp(dropTarget, item));
    */
  }

  checkNestingUp(parent: NodeParent, target: NodeData | Node): boolean {
    /*
    if (isElementNode(target) || isElementData(target)) {
      const proto = isElementNode(target)
        ? target.prototype
        : this.document.getPrototypeByTagNameOrURI(target.tagName, target.uri);
      if (proto) {
        return proto.checkNestingUp(target, parent);
      }
    }*/

    return true;
  }

  checkNestingDown(parent: NodeParent, target: NodeData | Node): boolean {
    /*
    const proto = parent.prototype;
    if (isConditionFlow(parent)) {
      return parent.children.every(
        child => proto.checkNestingDown(parent, child) && this.checkNestingUp(parent, child),
      );
    } else {
      return proto.checkNestingDown(parent, target) && this.checkNestingUp(parent, target);
    }*/
    return false;
  }
  // #endregion
}
