import { obx, autorun, computed, getPublicPath, hotkey, focusTracker } from '@ali/lowcode-editor-core';
import { ISimulatorHost, Component, NodeInstance, ComponentInstance } from '../simulator';
import Viewport from './viewport';
import { createSimulator } from './create-simulator';
import { Node, ParentalNode, DocumentModel, isNode, contains, isRootNode } from '../document';
import ResourceConsumer from './resource-consumer';
import {
  AssetLevel,
  Asset,
  AssetList,
  assetBundle,
  assetItem,
  AssetType,
  isElement,
  isFormEvent,
} from '@ali/lowcode-utils';
import {
  DragObjectType,
  isShaken,
  LocateEvent,
  isDragAnyObject,
  isDragNodeObject,
  LocationData,
  isLocationData,
  LocationChildrenDetail,
  LocationDetailType,
  isChildInline,
  isRowContainer,
  getRectTarget,
  Rect,
  CanvasPoint,
} from '../designer';
import { parseMetadata } from './utils/parse-metadata';
import { ComponentMetadata, ComponentSchema } from '@ali/lowcode-types';
import { BuiltinSimulatorRenderer } from './renderer';
import clipboard from '../designer/clipboard';
import { LiveEditing } from './live-editing/live-editing';

export interface LibraryItem {
  package: string;
  library: string;
  urls?: Asset;
}

export interface BuiltinSimulatorProps {
  // 从 documentModel 上获取
  // suspended?: boolean;
  designMode?: 'live' | 'design' | 'preview' | 'extend' | 'border';
  device?: 'mobile' | 'iphone' | string;
  deviceClassName?: string;
  environment?: Asset;
  extraEnvironment?: Asset;
  library?: LibraryItem[];
  simulatorUrl?: Asset;
  theme?: Asset;
  componentsAsset?: Asset;
  [key: string]: any;
}

const defaultSimulatorUrl = (() => {
  const publicPath = getPublicPath();
  let urls;
  const [_, prefix = '', dev] = /^(.+?)(\/js)?\/?$/.exec(publicPath) || [];
  if (dev) {
    urls = [`${prefix}/css/react-simulator-renderer.css`, `${prefix}/js/react-simulator-renderer.js`];
  } else if (process.env.NODE_ENV === 'production') {
    urls = [`${prefix}/react-simulator-renderer.css`, `${prefix}/react-simulator-renderer.js`];
  } else {
    urls = [`${prefix}/react-simulator-renderer.css`, `${prefix}/react-simulator-renderer.js`];
  }
  return urls;
})();

const defaultRaxSimulatorUrl = (() => {
  const publicPath = getPublicPath();
  let urls;
  const [_, prefix = '', dev] = /^(.+?)(\/js)?\/?$/.exec(publicPath) || [];
  if (dev) {
    urls = [`${prefix}/css/rax-simulator-renderer.css`, `${prefix}/js/rax-simulator-renderer.js`];
  } else if (process.env.NODE_ENV === 'production') {
    urls = [`${prefix}/rax-simulator-renderer.css`, `${prefix}/rax-simulator-renderer.js`];
  } else {
    urls = [`${prefix}/rax-simulator-renderer.css`, `${prefix}/rax-simulator-renderer.js`];
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
];

const defaultRaxEnvironment = [
  assetItem(
    AssetType.JSText,
    'window.Rax=parent.Rax;window.React=parent.React;window.ReactDOM=parent.ReactDOM;window.VisualEngineUtils=parent.VisualEngineUtils;window.VisualEngine=parent.VisualEngine',
  ),
  assetItem(
    AssetType.JSText,
    'window.PropTypes=parent.PropTypes;React.PropTypes=parent.PropTypes; window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;',
  ),
];

export class BuiltinSimulatorHost implements ISimulatorHost<BuiltinSimulatorProps> {
  readonly isSimulator = true;

  constructor(readonly document: DocumentModel) {}

  readonly designer = this.document.designer;

  @computed get renderEnv(): string {
    return this.get('renderEnv') || 'default';
  }

  @computed get device(): string {
    return this.get('device') || 'default';
  }

  @computed get deviceClassName(): string | undefined {
    return this.get('deviceClassName');
  }

  @computed get designMode(): 'live' | 'design' | 'preview' {
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

  @obx.ref _props: BuiltinSimulatorProps = {};
  /**
   * @see ISimulator
   */
  setProps(props: BuiltinSimulatorProps) {
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
  connect(renderer: BuiltinSimulatorRenderer, fn: (context: { dispose: () => void; firstRun: boolean }) => void) {
    this._renderer = renderer;
    return autorun(fn as any, true);
  }

  purge(): void {
    // todo
  }

  readonly viewport = new Viewport();
  readonly scroller = this.designer.createScroller(this.viewport);

  mountViewport(viewport: Element | null) {
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

  private _renderer?: BuiltinSimulatorRenderer;
  get renderer() {
    return this._renderer;
  }

  readonly componentsConsumer = new ResourceConsumer<Asset | undefined>(() => this.componentsAsset);

  readonly injectionConsumer = new ResourceConsumer(() => {
    return {};
  });

  readonly libraryMap: { [key: string]: string } = {};

  private _iframe?: HTMLIFrameElement;
  async mountContentFrame(iframe: HTMLIFrameElement | null) {
    if (!iframe || this._iframe === iframe) {
      return;
    }
    this._iframe = iframe;

    this._contentWindow = iframe.contentWindow!;

    const library = this.get('library') as LibraryItem[];
    const libraryAsset: AssetList = [];
    if (library) {
      library.forEach((item) => {
        this.libraryMap[item.package] = item.library;
        if (item.urls) {
          libraryAsset.push(item.urls);
        }
      });
    }

    const vendors = [
      // required & use once
      assetBundle(
        this.get('environment') || this.renderEnv === 'rax' ? defaultRaxEnvironment : defaultEnvironment,
        AssetLevel.Environment,
      ),
      // required & use once
      assetBundle(this.get('extraEnvironment'), AssetLevel.Environment),
      // required & use once
      assetBundle(libraryAsset, AssetLevel.Library),
      // required & TODO: think of update
      assetBundle(this.theme, AssetLevel.Theme),
      // required & use once
      assetBundle(
        this.get('simulatorUrl') || this.renderEnv === 'rax' ? defaultRaxSimulatorUrl : defaultSimulatorUrl,
        AssetLevel.Runtime,
      ),
    ];

    // wait 准备 iframe 内容、依赖库注入
    const renderer = await createSimulator(this, iframe, vendors);

    // TODO: !!! thinkof reload onload

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

    // bind hotkey & clipboard
    hotkey.mount(this._contentWindow);
    focusTracker.mount(this._contentWindow);
    clipboard.injectCopyPaster(this._contentDocument);
    // TODO: dispose the bindings
  }

  setupEvents() {
    // TODO: Thinkof move events control to simulator renderer
    //       just listen special callback
    // because iframe maybe reload
    this.setupDragAndClick();
    this.setupDetecting();
    this.setupLiveEditing();
    this.setupContextMenu();
  }

  setupDragAndClick() {
    const documentModel = this.document;
    const selection = documentModel.selection;
    const designer = documentModel.designer;
    const doc = this.contentDocument!;

    // TODO: think of lock when edit a node
    // 事件路由
    doc.addEventListener(
      'mousedown',
      (downEvent: MouseEvent) => {
        // fix for popups close logic
        document.dispatchEvent(new Event('mousedown'));
        if (this.liveEditing.editing) {
          return;
        }
        // stop response document focus event
        downEvent.stopPropagation();
        downEvent.preventDefault();

        // FIXME: dirty fix remove label-for fro liveEditing
        (downEvent.target as HTMLElement).removeAttribute('for');

        const nodeInst = this.getNodeInstanceFromElement(downEvent.target as Element);
        const node = nodeInst?.node || this.document.rootNode;
        const isMulti = downEvent.metaKey || downEvent.ctrlKey;
        const isLeftButton = downEvent.which === 1 || downEvent.button === 0;
        const checkSelect = (e: MouseEvent) => {
          doc.removeEventListener('mouseup', checkSelect, true);
          if (!isShaken(downEvent, e)) {
            const id = node.id;
            designer.activeTracker.track({ node, instance: nodeInst?.instance });
            if (isMulti && !isRootNode(node) && selection.has(id)) {
              selection.remove(id);
            } else {
              selection.select(id);
              const editor = this.designer?.editor;
              const npm = node?.componentMeta?.npm;
              const selected =
                [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
                node?.componentMeta?.componentName ||
                '';
              editor?.emit('designer.builtinSimulator.select', {
                selected,
              });
            }
          }
        };

        if (isLeftButton && !isRootNode(node)) {
          let nodes: Node[] = [node];
          let ignoreUpSelected = false;
          if (isMulti) {
            // multi select mode, directily add
            if (!selection.has(node.id)) {
              designer.activeTracker.track({ node, instance: nodeInst?.instance });
              selection.add(node.id);
              ignoreUpSelected = true;
            }
            selection.remove(this.document.rootNode.id);
            // 获得顶层 nodes
            nodes = selection.getTopNodes();
          } else if (selection.containsNode(node, true)) {
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
      },
      true,
    );

    doc.addEventListener(
      'click',
      (e) => {
        // fix for popups close logic
        const x = new Event('click');
        x.initEvent('click', true);
        this._iframe?.dispatchEvent(x);
        const target = e.target as HTMLElement;
        if (
          isFormEvent(e) ||
          target?.closest(
            '.next-input-group,.next-checkbox-group,.next-date-picker,.next-input,.next-month-picker,.next-number-picker,.next-radio-group,.next-range,.next-range-picker,.next-rating,.next-select,.next-switch,.next-time-picker,.next-upload,.next-year-picker,.next-breadcrumb-item,.next-calendar-header,.next-calendar-table',
          )
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
        // stop response document click event
        // todo: catch link redirect
      },
      true,
    );
  }

  private disableHovering?: () => void;
  /**
   * 设置悬停处理
   */
  setupDetecting() {
    const doc = this.contentDocument!;
    const detecting = this.document.designer.detecting;
    const hover = (e: MouseEvent) => {
      if (!detecting.enable) {
        return;
      }
      const nodeInst = this.getNodeInstanceFromElement(e.target as Element);
      console.log('nodeInst', nodeInst);
      detecting.capture(nodeInst?.node || null);
      e.stopPropagation();
    };
    const leave = () => detecting.leave(this.document);

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
      detecting.leave(this.document);
      doc.removeEventListener('mouseover', hover, true);
      doc.removeEventListener('mouseleave', leave, false);
      this.disableHovering = undefined;
    };
  }

  readonly liveEditing = new LiveEditing();
  setupLiveEditing() {
    const doc = this.contentDocument!;
    // cause edit
    doc.addEventListener(
      'dblclick',
      (e: MouseEvent) => {
        // stop response document dblclick event
        e.stopPropagation();
        e.preventDefault();

        const targetElement = e.target as HTMLElement;
        const nodeInst = this.getNodeInstanceFromElement(targetElement);
        if (!nodeInst) {
          return;
        }
        const node = nodeInst.node || this.document.rootNode;

        const rootElement = this.findDOMNodes(nodeInst.instance, node.componentMeta.rootSelector)?.find((item) =>
          item.contains(targetElement),
        ) as HTMLElement;
        if (!rootElement) {
          return;
        }

        this.liveEditing.apply({
          node,
          rootElement,
          event: e,
        });
      },
      true,
    );
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
        this.setupDetecting();
      }
    }
  }

  setupContextMenu() {
    const doc = this.contentDocument!;
    doc.addEventListener('contextmenu', (e: MouseEvent) => {
      const targetElement = e.target as HTMLElement;
      const nodeInst = this.getNodeInstanceFromElement(targetElement);
      if (!nodeInst) {
        return;
      }
      const node = nodeInst.node || this.document.rootNode;
      if (!node) {
        return;
      }
      const editor = this.designer?.editor;
      const npm = node?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        node?.componentMeta?.componentName ||
        '';
      editor?.emit('desiger.builtinSimulator.contextmenu', {
        selected,
      });
    });
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

    if (!component) {
      return {
        componentName,
      };
    }

    // TODO:
    // 1. generate builtin div/p/h1/h2
    // 2. read propTypes

    return {
      componentName,
      ...parseMetadata(component),
    };
  }

  /**
   * @see ISimulator
   */
  getComponent(componentName: string): Component | null {
    return this.renderer?.getComponent(componentName) || null;
  }

  createComponent(schema: ComponentSchema): Component | null {
    return this.renderer?.createComponent(schema) || null;
  }

  @obx.val private instancesMap = new Map<string, ComponentInstance[]>();
  setInstance(id: string, instances: ComponentInstance[] | null) {
    if (instances == null) {
      this.instancesMap.delete(id);
    } else {
      this.instancesMap.set(id, instances.slice());
    }
  }

  /**
   * @see ISimulator
   */
  getComponentInstances(node: Node): ComponentInstance[] | null {
    return this.instancesMap.get(node.id) || null;
  }

  /**
   * @see ISimulator
   */
  getComponentInstanceId(instance: ComponentInstance) {
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
  getClosestNodeInstance(from: ComponentInstance, specId?: string): NodeInstance<ComponentInstance> | null {
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
    return this.computeComponentInstanceRect(instances[0], node.componentMeta.rootSelector);
  }

  /**
   * @see ISimulator
   */
  computeComponentInstanceRect(instance: ComponentInstance, selector?: string): Rect | null {
    const renderer = this.renderer!;
    const elements = this.findDOMNodes(instance, selector);
    if (!elements) {
      return null;
    }

    const elems = elements.slice();
    let rects: DOMRect[] | undefined;
    let last: { x: number; y: number; r: number; b: number } | undefined;
    let computed = false;
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
      if (rect.width === 0 && rect.height === 0) {
        continue;
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
  findDOMNodes(instance: ComponentInstance, selector?: string): Array<Element | Text> | null {
    const elements = this._renderer?.findDOMNodes(instance);
    if (!elements) {
      return null;
    }

    if (selector) {
      const matched = getMatched(elements, selector);
      if (!matched) {
        return null;
      }
      return [matched];
    }
    return elements;
  }

  /**
   * 通过 DOM 节点获取节点，依赖 simulator 的接口
   */
  getNodeInstanceFromElement(target: Element | null): NodeInstance<ComponentInstance> | null {
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
    const dropContainer = this.getDropContainer(e);
    if (
      !dropContainer ||
      // too dirty
      (typeof dropContainer.container?.componentMeta?.prototype?.options?.canDropIn === 'function' &&
        !dropContainer.container?.componentMeta?.prototype?.options?.canDropIn(e.dragObject.nodes[0]))
    ) {
      return null;
    }

    if (isLocationData(dropContainer)) {
      return this.designer.createLocation(dropContainer);
    }

    const { container, instance: containerInstance } = dropContainer;

    const edge = this.computeComponentInstanceRect(containerInstance, container.componentMeta.rootSelector);

    if (!edge) {
      return null;
    }

    const children = container.children;

    const detail: LocationChildrenDetail = {
      type: LocationDetailType.Children,
      index: 0,
      edge,
    };

    const locationData = {
      target: container,
      detail,
      source: 'simulator' + this.document.id,
      event: e,
    };

    if (e.dragObject.nodes[0].getPrototype().isModal()) {
      return this.designer.createLocation({
        target: this.document.rootNode,
        detail,
        source: 'simulator' + this.document.id,
        event: e,
      });
    }

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
          ? instances.find((inst) => this.getClosestNodeInstance(inst, container.id)?.instance === containerInstance)
          : instances[0]
        : null;
      const rect = inst ? this.computeComponentInstanceRect(inst, node.componentMeta.rootSelector) : null;

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

  /**
   * 查找合适的投放容器
   */
  getDropContainer(e: LocateEvent): DropContainer | LocationData | null {
    const { target, dragObject } = e;
    const isAny = isDragAnyObject(dragObject);
    const { modalNode, currentRoot } = this.document;
    let container: Node;
    let nodeInstance: NodeInstance<ComponentInstance> | undefined;

    if (target) {
      const ref = this.getNodeInstanceFromElement(target);
      if (ref?.node) {
        nodeInstance = ref;
        container = ref.node;
      } else if (isAny) {
        return null;
      } else {
        container = currentRoot;
      }
    } else if (isAny) {
      return null;
    } else {
      container = currentRoot;
    }

    if (!container.isParental()) {
      container = container.parent || currentRoot;
    }

    // check container if in modalNode layer, if not, use modalNode
    if (modalNode && !modalNode.contains(container)) {
      container = modalNode;
    }

    // TODO: use spec container to accept specialData
    if (isAny) {
      // will return locationData
      return null;
    }

    // get common parent, avoid drop container contains by dragObject
    // TODO: renderengine support pointerEvents: none for acceleration
    const drillDownExcludes = new Set<Node>();
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
        container = p || this.document.rootNode;
        drillDownExcludes.add(container);
      }
    }

    const ret: any = {
      container,
    };
    if (nodeInstance) {
      if (nodeInstance.node === container) {
        ret.instance = nodeInstance.instance;
      } else {
        ret.instance = this.getClosestNodeInstance(nodeInstance.instance as any, container.id)?.instance;
      }
    } else {
      ret.instance = this.getComponentInstances(container)?.[0];
    }

    let res: any;
    let upward: any;
    // TODO: complete drill down logic
    while (container) {
      if (ret.container !== container) {
        ret.container = container;
        ret.instance = this.getClosestNodeInstance(ret.instance, container.id)?.instance;
      }
      res = this.handleAccept(ret, e);
      if (isLocationData(res)) {
        return res;
      }
      if (res === true) {
        return ret;
      }
      if (!res) {
        drillDownExcludes.add(container);
        if (upward) {
          container = upward;
          upward = null;
        } else if (container.parent) {
          container = container.parent;
        } else {
          return null;
        }
      } else if (isNode(res)) {
        /* else if (res === DRILL_DOWN) {
        if (!upward) {
          upward = container.parent;
        }
        container = this.getNearByContainer(container, drillExcludes, e);
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

  isAcceptable(container: ParentalNode): boolean {
    return false;
    /*
    const meta = container.componentMeta;
    const instance: any = this.document.getView(container);
    if (instance && '$accept' in instance) {
      return true;
    }
    return meta.acceptable;
    */
  }

  /**
   * 控制接受
   */
  handleAccept({ container, instance }: DropContainer, e: LocateEvent) {
    const { dragObject } = e;
    if (isRootNode(container)) {
      return this.document.checkDropTarget(container, dragObject as any);
    }

    const meta = (container as Node).componentMeta;

    // FIXME: get containerInstance for accept logic use
    const acceptable: boolean = this.isAcceptable(container);
    if (!meta.isContainer && !acceptable) {
      return false;
    }

    // first use accept
    if (acceptable) {
      /*
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
      */
    }

    // check nesting
    return this.document.checkNesting(container, dragObject as any);
  }

  /**
   * 查找邻近容器
   */
  getNearByContainer(container: ParentalNode, e: LocateEvent) {
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

    return nearBy;
    */
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

function getMatched(elements: Array<Element | Text>, selector: string): Element | null {
  let firstQueried: Element | null = null;
  for (const elem of elements) {
    if (isElement(elem)) {
      if (elem.matches(selector)) {
        return elem;
      }

      if (!firstQueried) {
        firstQueried = elem.querySelector(selector);
      }
    }
  }
  return firstQueried;
}

interface DropContainer {
  container: ParentalNode;
  instance: ComponentInstance;
}
