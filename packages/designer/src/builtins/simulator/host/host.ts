import { obx, autorun, computed } from '@recore/obx';
import { ISimulator, Component, NodeInstance } from '../../../designer/simulator';
import Viewport from './viewport';
import { createSimulator } from './create-simulator';
import { SimulatorRenderer } from '../renderer/renderer';
import Node, { NodeParent, isNodeParent, isNode, contains } from '../../../designer/document/node/node';
import DocumentModel from '../../../designer/document/document-model';
import ResourceConsumer from './resource-consumer';
import { AssetLevel, Asset, AssetList, assetBundle, assetItem, AssetType } from '../utils/asset';
import {
  DragObjectType,
  isShaken,
  LocateEvent,
  DragNodeObject,
  DragNodeDataObject,
  isDragAnyObject,
  isDragNodeObject,
  isDragNodeDataObject,
} from '../../../designer/helper/dragon';
import {
  LocationData,
  isLocationData,
  LocationChildrenDetail,
  LocationDetailType,
  isChildInline,
  isRowContainer,
  getRectTarget,
  Rect,
  CanvasPoint,
} from '../../../designer/helper/location';
import { isNodeSchema, NodeSchema } from '../../../designer/schema';
import { ComponentMetadata } from '../../../designer/component-meta';
import { ReactInstance } from 'react';
import { isRootNode } from '../../../designer/document/node/root-node';
import { parseProps } from '../utils/parse-props';

export interface LibraryItem {
  package: string;
  library: string;
  urls: Asset;
}

export interface SimulatorProps {
  // 从 documentModel 上获取
  // suspended?: boolean;
  designMode?: 'live' | 'design' | 'mock' | 'extend' | 'border' | 'preview';
  device?: 'mobile' | 'iphone' | string;
  deviceClassName?: string;
  simulatorUrl?: Asset;
  environment?: Asset;
  library?: LibraryItem[];
  theme?: Asset;
  componentsAsset?: Asset;
  [key: string]: any;
}

const publicPath = (document.currentScript as HTMLScriptElement).src.replace(/^(.*\/)[^/]+$/, '$1');

const defaultSimulatorUrl = (() => {
  let urls;
  if (process.env.NODE_ENV === 'production') {
    urls = [`${publicPath}../css/simulator-renderer.min.css`, `${publicPath}simulator-renderer.min.js`];
  } else {
    urls = [`${publicPath}../css/simulator-renderer.css`, `${publicPath}simulator-renderer.js`];
  }
  return urls;
})();

const defaultEnvironment = [
  // https://g.alicdn.com/mylib/??react/16.11.0/umd/react.production.min.js,react-dom/16.8.6/umd/react-dom.production.min.js,prop-types/15.7.2/prop-types.min.js
  assetItem(AssetType.JSText, 'window.React=parent.React;window.ReactDOM=parent.ReactDOM;', undefined, 'react'),
  assetItem(
    AssetType.JSText,
    'window.PropTypes=parent.PropTypes;React.PropTypes=parent.PropTypes; window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;',
  ),
  assetItem(AssetType.JSUrl, '/statics/lowcode-renderer.js'),
];

export class SimulatorHost implements ISimulator<SimulatorProps> {
  readonly isSimulator = true;

  constructor(readonly document: DocumentModel) {}

  readonly designer = this.document.designer;

  @computed get device(): string | undefined {
    // 根据 device 不同来做画布外框样式变化  渲染时可选择不同组件
    // renderer 依赖
    return this.get('device') || 'default';
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

  @computed get theme(): Asset | undefined {
    return this.get('theme');
  }

  @computed get componentsMap() {
    // renderer 依赖
    return this.designer.componentsMap;
  }

  @obx.ref _props: SimulatorProps = {};
  /**
   * @see ISimulator
   */
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

  purge(): void {
    // todo
  }

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

  readonly libraryMap: { [key: string]: string } = {};

  async mountContentFrame(iframe: HTMLIFrameElement | null) {
    if (!iframe) {
      return;
    }

    this._contentWindow = iframe.contentWindow!;

    const library = this.get('library') as LibraryItem[];
    const libraryAsset: AssetList = [];
    if (library) {
      library.forEach(item => {
        this.libraryMap[item.package] = item.library;
        libraryAsset.push(item.urls);
      });
    }

    const vendors = [
      // required & use once
      assetBundle(this.get('environment') || defaultEnvironment, AssetLevel.Environment),
      // required & use once
      assetBundle(libraryAsset, AssetLevel.Library),
      // required & TODO: think of update
      assetBundle(this.theme, AssetLevel.Theme),
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
      const nodeInst = this.getNodeInstanceFromElement(downEvent.target as Element);
      const node = nodeInst?.node || this.document.rootNode;
      const isMulti = downEvent.metaKey || downEvent.ctrlKey;
      const isLeftButton = downEvent.which === 1 || downEvent.button === 0;
      const checkSelect = (e: MouseEvent) => {
        doc.removeEventListener('mouseup', checkSelect, true);
        if (!isShaken(downEvent, e)) {
          const id = node.id;
          designer.activeTracker.track(node);
          if (isMulti && !isRootNode(node) && selection.has(id)) {
            selection.remove(id);
          } else {
            selection.select(id);
          }
        }
      };

      if (isLeftButton && !isRootNode(node)) {
        let nodes: Node[] = [node];
        let ignoreUpSelected = false;
        // 排除根节点拖拽
        selection.remove(this.document.rootNode.id);
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
      const nodeInst = this.getNodeInstanceFromElement(e.target as Element);
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

  /**
   * @see ISimulator
   */
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

  /**
   * @see ISimulator
   */
  generateComponentMetadata(componentName: string): ComponentMetadata {
    // if html tags
    if (isHTMLTag(componentName)) {
      return {
        componentName,
        // TODO: read builtins html metadata
      };
    }

    const component = this.getComponent(componentName);

    if (component) {
      parseProps(component as any);
    }

    // TODO:
    // 1. generate builtin div/p/h1/h2
    // 2. read propTypes
    return {
      componentName,
      props: parseProps(this.getComponent(componentName)),
    };
  }

  /**
   * @see ISimulator
   */
  getComponent(componentName: string): Component | null {
    return this.renderer?.getComponent(componentName) || null;
  }

  @obx.val private instancesMap = new Map<string, ReactInstance[]>();
  setInstance(id: string, instances: ReactInstance[] | null) {
    if (instances == null) {
      this.instancesMap.delete(id);
    } else {
      this.instancesMap.set(id, instances.slice());
    }
  }

  /**
   * @see ISimulator
   */
  getComponentInstances(node: Node): ReactInstance[] | null {
    return this.instancesMap.get(node.id) || null;
  }

  /**
   * @see ISimulator
   */
  getComponentInstanceId(instance: ReactInstance) {
    throw new Error('Method not implemented.');
  }

  /**
   * @see ISimulator
   */
  getComponentContext(node: Node): object {
    throw new Error('Method not implemented.');
  }

  /**
   * @see ISimulator
   */
  getClosestNodeInstance(from: ReactInstance, specId?: string): NodeInstance<ReactInstance> | null {
    return this.renderer?.getClosestNodeInstance(from, specId) || null;
  }

  /**
   * @see ISimulator
   */
  computeRect(node: Node): Rect | null {
    const instances = this.getComponentInstances(node);
    if (!instances) {
      return null;
    }
    return this.computeComponentInstanceRect(instances[0]);
  }

  /**
   * @see ISimulator
   */
  computeComponentInstanceRect(instance: ReactInstance): Rect | null {
    const renderer = this.renderer!;
    const elements = renderer.findDOMNodes(instance);
    if (!elements) {
      return null;
    }

    let rects: DOMRect[] | undefined;
    let last: { x: number; y: number; r: number; b: number } | undefined;
    let computed = false;
    const elems = elements.slice();
    while (true) {
      if (!rects || rects.length < 1) {
        const elem = elems.pop();
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
        computed = true;
      }
      if (rect.top < last.y) {
        last.y = rect.top;
        computed = true;
      }
      if (rect.right > last.r) {
        last.r = rect.right;
        computed = true;
      }
      if (rect.bottom > last.b) {
        last.b = rect.bottom;
        computed = true;
      }
    }

    if (last) {
      const r: any = new DOMRect(last.x, last.y, last.r - last.x, last.b - last.y);
      r.elements = elements;
      r.computed = computed;
      return r;
    }

    return null;
  }

  /**
   * @see ISimulator
   */
  findDOMNodes(instance: ReactInstance): Array<Element | Text> | null {
    return this._renderer?.findDOMNodes(instance) || null;
  }

  /**
   * 通过 DOM 节点获取节点，依赖 simulator 的接口
   */
  getNodeInstanceFromElement(target: Element | null): NodeInstance | null {
    if (!target) {
      return null;
    }

    const nodeIntance = this.getClosestNodeInstance(target);
    if (!nodeIntance) {
      return null;
    }
    const node = this.document.getNode(nodeIntance.nodeId);
    return {
      ...nodeIntance,
      node,
    };
  }

  private tryScrollAgain: number | null = null;
  /**
   * @see ISimulator
   */
  scrollToNode(node: Node, detail?: any, tryTimes = 0) {
    this.tryScrollAgain = null;
    if (this.sensing) {
      // actived sensor
      return;
    }

    const opt: any = {};
    const scroll = false;

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
  /**
   * @see ISimulator
   */
  setNativeSelection(enableFlag: boolean) {
    this.renderer?.setNativeSelection(enableFlag);
  }
  /**
   * @see ISimulator
   */
  setDraggingState(state: boolean) {
    this.renderer?.setDraggingState(state);
  }
  /**
   * @see ISimulator
   */
  setCopyState(state: boolean) {
    this.renderer?.setCopyState(state);
  }
  /**
   * @see ISimulator
   */
  clearState() {
    this.renderer?.clearState();
  }

  private _sensorAvailable = true;
  /**
   * @see ISensor
   */
  get sensorAvailable(): boolean {
    return this._sensorAvailable;
  }

  /**
   * @see ISensor
   */
  fixEvent(e: LocateEvent): LocateEvent {
    if (e.fixed) {
      return e;
    }

    const notMyEvent = e.originalEvent.view?.document !== this.contentDocument;
    // fix canvasX canvasY : 当前激活文档画布坐标系
    if (notMyEvent || !('canvasX' in e) || !('canvasY' in e)) {
      const l = this.viewport.toLocalPoint({
        clientX: e.globalX,
        clientY: e.globalY,
      });
      e.canvasX = l.clientX;
      e.canvasY = l.clientY;
    }

    // fix target : 浏览器事件响应目标
    if (!e.target || notMyEvent) {
      e.target = this.contentDocument!.elementFromPoint(e.canvasX!, e.canvasY!);
    }

    // documentModel : 目标文档
    e.documentModel = this.document;

    // 事件已订正
    e.fixed = true;
    return e;
  }

  /**
   * @see ISensor
   */
  isEnter(e: LocateEvent): boolean {
    const rect = this.viewport.bounds;
    return e.globalY >= rect.top && e.globalY <= rect.bottom && e.globalX >= rect.left && e.globalX <= rect.right;
  }

  private sensing = false;
  /**
   * @see ISensor
   */
  deactiveSensor() {
    this.sensing = false;
    this.scroller.cancel();
  }

  // ========= drag location logic: hepler for locate ==========

  /**
   * @see ISensor
   */
  locate(e: LocateEvent): any {
    this.sensing = true;
    this.scroller.scrolling(e);
    const dropTarget = this.getDropTarget(e);
    if (!dropTarget) {
      return null;
    }

    if (isLocationData(dropTarget)) {
      return this.designer.createLocation(dropTarget);
    }

    const target = dropTarget;
    const targetInstance = e.targetInstance as ReactInstance;

    const parentInstance = this.getClosestNodeInstance(targetInstance, target.id);
    const edge = this.computeComponentInstanceRect(parentInstance?.instance as any);

    if (!edge) {
      return null;
    }

    const children = target.children;

    const detail: LocationChildrenDetail = {
      type: LocationDetailType.Children,
      index: 0,
      edge,
    };

    const locationData = {
      target,
      detail,
    };

    if (!children || children.size < 1 || !edge) {
      return this.designer.createLocation(locationData);
    }

    let nearRect = null;
    let nearIndex = 0;
    let nearNode = null;
    let nearDistance = null;
    let minTop = null;
    let maxBottom = null;

    for (let i = 0, l = children.size; i < l; i++) {
      const node = children.get(i)!;
      const index = i;
      const instances = this.getComponentInstances(node);
      const inst = instances
        ? instances.length > 1
          ? instances.find(inst => this.getClosestNodeInstance(inst, target.id)?.instance === targetInstance)
          : instances[0]
        : null;
      const rect = inst ? this.computeComponentInstanceRect(inst) : null;

      if (!rect) {
        continue;
      }

      const distance = isPointInRect(e as any, rect) ? 0 : distanceToRect(e as any, rect);

      if (distance === 0) {
        nearDistance = distance;
        nearNode = node;
        nearIndex = index;
        nearRect = rect;
        break;
      }

      // 标记子节点最顶
      if (minTop === null || rect.top < minTop) {
        minTop = rect.top;
      }
      // 标记子节点最底
      if (maxBottom === null || rect.bottom > maxBottom) {
        maxBottom = rect.bottom;
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
      if (isNearAfter(e as any, nearRect, vertical)) {
        near.pos = 'after';
        detail.index = nearIndex + 1;
      }
      if (!row && nearDistance !== 0) {
        const edgeDistance = distanceToEdge(e as any, edge);
        if (edgeDistance.distance < nearDistance!) {
          const nearAfter = edgeDistance.nearAfter;
          if (minTop == null) {
            minTop = edge.top;
          }
          if (maxBottom == null) {
            maxBottom = edge.bottom;
          }
          near.rect = new DOMRect(edge.left, minTop, edge.width, maxBottom - minTop);
          near.align = 'H';
          near.pos = nearAfter ? 'after' : 'before';
          detail.index = nearAfter ? children.size : 0;
        }
      }
    }

    return this.designer.createLocation(locationData);
  }

  getDropTarget(e: LocateEvent): NodeParent | LocationData | null {
    const { target, dragObject } = e;
    const isAny = isDragAnyObject(dragObject);
    let container: any;

    if (target) {
      const ref = this.getNodeInstanceFromElement(target);
      if (ref?.node) {
        e.targetInstance = ref.instance;
        e.targetNode = ref.node;
        container = ref.node;
      } else if (isAny) {
        return null;
      } else {
        container = this.document.rootNode;
      }
    } else if (isAny) {
      return null;
    } else {
      container = this.document.rootNode;
    }

    if (!isNodeParent(container) && !isRootNode(container)) {
      container = container.parent;
    }

    if (isAny) {
      // TODO: use spec container to accept specialData
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
      } else if (isNode(res)) {
        /* else if (res === AT_CHILD) {
        if (!upward) {
          upward = container.parent;
        }
        container = this.getNearByContainer(container, e);
        if (!container) {
          container = upward;
          upward = null;
        }
      }*/
        container = res;
        upward = null;
      }
    }
    return null;
  }

  acceptNodes(container: NodeParent, e: LocateEvent) {
    const { dragObject } = e;
    if (isRootNode(container)) {
      return this.checkDropTarget(container, dragObject as any);
    }

    const config = container.componentMeta;

    if (!config.isContainer) {
      return false;
    }
    // check is contains, get common parent
    if (isDragNodeObject(dragObject)) {
      const nodes = dragObject.nodes;
      let i = nodes.length;
      let p: any = container;
      while (i-- > 0) {
        if (contains(nodes[i], p)) {
          p = nodes[i].parent;
        }
      }
      if (p !== container) {
        return p || this.document.rootNode;
      }
    }

    return this.checkNesting(container, dragObject as any);
  }

  /*
  getNearByContainer(container: NodeParent, e: LocateEvent) {

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

    return nearBy;
  }
  */

  checkNesting(dropTarget: NodeParent, dragObject: DragNodeObject | DragNodeDataObject): boolean {
    let items: Array<Node | NodeSchema>;
    if (isDragNodeDataObject(dragObject)) {
      items = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data];
    } else {
      items = dragObject.nodes;
    }
    return items.every(item => this.checkNestingDown(dropTarget, item));
  }

  checkDropTarget(dropTarget: NodeParent, dragObject: DragNodeObject | DragNodeDataObject): boolean {
    let items: Array<Node | NodeSchema>;
    if (isDragNodeDataObject(dragObject)) {
      items = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data];
    } else {
      items = dragObject.nodes;
    }
    return items.every(item => this.checkNestingUp(dropTarget, item));
  }

  checkNestingUp(parent: NodeParent, target: NodeSchema | Node): boolean {
    if (isNode(target) || isNodeSchema(target)) {
      const config = isNode(target) ? target.componentMeta : this.document.getComponentMeta(target.componentName);
      if (config) {
        return config.checkNestingUp(target, parent);
      }
    }

    return true;
  }

  checkNestingDown(parent: NodeParent, target: NodeSchema | Node): boolean {
    const config = parent.componentMeta;
    return config.checkNestingDown(parent, target) && this.checkNestingUp(parent, target);
  }
  // #endregion
}

function isHTMLTag(name: string) {
  return /^[a-z]\w*$/.test(name);
}

function isPointInRect(point: CanvasPoint, rect: Rect) {
  return (
    point.canvasY >= rect.top &&
    point.canvasY <= rect.bottom &&
    point.canvasX >= rect.left &&
    point.canvasX <= rect.right
  );
}

function distanceToRect(point: CanvasPoint, rect: Rect) {
  let minX = Math.min(Math.abs(point.canvasX - rect.left), Math.abs(point.canvasX - rect.right));
  let minY = Math.min(Math.abs(point.canvasY - rect.top), Math.abs(point.canvasY - rect.bottom));
  if (point.canvasX >= rect.left && point.canvasX <= rect.right) {
    minX = 0;
  }
  if (point.canvasY >= rect.top && point.canvasY <= rect.bottom) {
    minY = 0;
  }

  return Math.sqrt(minX ** 2 + minY ** 2);
}

function distanceToEdge(point: CanvasPoint, rect: Rect) {
  const distanceTop = Math.abs(point.canvasY - rect.top);
  const distanceBottom = Math.abs(point.canvasY - rect.bottom);

  return {
    distance: Math.min(distanceTop, distanceBottom),
    nearAfter: distanceBottom < distanceTop,
  };
}

function isNearAfter(point: CanvasPoint, rect: Rect, inline: boolean) {
  if (inline) {
    return (
      Math.abs(point.canvasX - rect.left) + Math.abs(point.canvasY - rect.top) >
      Math.abs(point.canvasX - rect.right) + Math.abs(point.canvasY - rect.bottom)
    );
  }
  return Math.abs(point.canvasY - rect.top) > Math.abs(point.canvasY - rect.bottom);
}
