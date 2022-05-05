import {
  obx,
  autorun,
  reaction,
  computed,
  getPublicPath,
  hotkey,
  focusTracker,
  engineConfig,
  IReactionPublic,
  IReactionOptions,
  IReactionDisposer,
  makeObservable,
} from '@alilc/lowcode-editor-core';
import { EventEmitter } from 'events';
import {
  ISimulatorHost,
  Component,
  NodeInstance,
  ComponentInstance,
  DropContainer,
} from '../simulator';
import Viewport from './viewport';
import { createSimulator } from './create-simulator';
import { Node, ParentalNode, contains, isRootNode, isLowCodeComponent } from '../document';
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
  hasOwnProperty,
  UtilsMetadata,
  getClosestNode,
} from '@alilc/lowcode-utils';
import {
  DragObjectType,
  DragNodeObject,
  isShaken,
  LocateEvent,
  isDragAnyObject,
  isDragNodeObject,
  isLocationData,
  LocationChildrenDetail,
  LocationDetailType,
  isChildInline,
  isRowContainer,
  getRectTarget,
  Rect,
  CanvasPoint,
  Designer,
} from '../designer';
import { parseMetadata } from './utils/parse-metadata';
import { getClosestClickableNode } from './utils/clickable';
import {
  ComponentMetadata,
  ComponentSchema,
  TransformStage,
  ActivityData,
  Package,
} from '@alilc/lowcode-types';
import { BuiltinSimulatorRenderer } from './renderer';
import clipboard from '../designer/clipboard';
import { LiveEditing } from './live-editing/live-editing';
import { Project } from '../project';
import { Scroller } from '../designer/scroller';
import { isElementNode, isDOMNodeVisible } from '../utils/misc';

export interface LibraryItem extends Package{
  package: string;
  library: string;
  urls?: Asset;
  editUrls?: Asset;
}

export interface DeviceStyleProps {
  canvas?: object;
  viewport?: object;
}

export interface BuiltinSimulatorProps {
  // 从 documentModel 上获取
  // suspended?: boolean;
  designMode?: 'live' | 'design' | 'preview' | 'extend' | 'border';
  device?: 'mobile' | 'iphone' | string;
  deviceClassName?: string;
  environment?: Asset;
  // @TODO 补充类型
  /** @property 请求处理器配置 */
  requestHandlersMap?: any;
  extraEnvironment?: Asset;
  library?: LibraryItem[];
  utilsMetadata?: UtilsMetadata;
  simulatorUrl?: Asset;
  theme?: Asset;
  componentsAsset?: Asset;
  [key: string]: any;
}

const defaultSimulatorUrl = (() => {
  const publicPath = getPublicPath();
  let urls;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, prefix = '', dev] = /^(.+?)(\/js)?\/?$/.exec(publicPath) || [];
  if (dev) {
    urls = [
      `${prefix}/css/react-simulator-renderer.css`,
      `${prefix}/js/react-simulator-renderer.js`,
    ];
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  assetItem(
    AssetType.JSText,
    'window.React=parent.React;window.ReactDOM=parent.ReactDOM;window.__is_simulator_env__=true;',
    undefined,
    'react',
  ),
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

  readonly project: Project;

  readonly designer: Designer;

  readonly viewport = new Viewport();

  readonly scroller: Scroller;

  readonly emitter: EventEmitter = new EventEmitter();

  readonly componentsConsumer: ResourceConsumer;

  readonly injectionConsumer: ResourceConsumer;

  /**
   * 是否为画布自动渲染
   */
  autoRender = true;

  constructor(project: Project) {
    makeObservable(this);
    this.project = project;
    this.designer = project?.designer;
    this.scroller = this.designer.createScroller(this.viewport);
    this.autoRender = !engineConfig.get('disableAutoRender', false);
    this.componentsConsumer = new ResourceConsumer<Asset | undefined>(() => this.componentsAsset);
    this.injectionConsumer = new ResourceConsumer(() => {
      return {
        i18n: this.project.i18n,
      };
    });
  }

  get currentDocument() {
    return this.project.currentDocument;
  }

  @computed get renderEnv(): string {
    return this.get('renderEnv') || 'default';
  }

  @computed get device(): string {
    return this.get('device') || 'default';
  }

  @computed get locale(): string {
    return this.get('locale');
  }

  @computed get deviceClassName(): string | undefined {
    return this.get('deviceClassName');
  }

  @computed get designMode(): 'live' | 'design' | 'preview' {
    // renderer 依赖
    // TODO: 需要根据 design mode 不同切换鼠标响应情况
    return this.get('designMode') || 'design';
  }

  @computed get requestHandlersMap(): any {
    // renderer 依赖
    // TODO: 需要根据 design mode 不同切换鼠标响应情况
    return this.get('requestHandlersMap') || null;
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

  @computed get deviceStyle(): DeviceStyleProps | undefined {
    return this.get('deviceStyle');
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
    if (key === 'device') {
      return (
        this.designer?.editor?.get('deviceMapper')?.transform?.(this._props.device) ||
        this._props.device
      );
    }
    return this._props[key];
  }

  /**
   * 有 Renderer 进程连接进来，设置同步机制
   */
  connect(
    renderer: BuiltinSimulatorRenderer,
    effect: (reaction: IReactionPublic) => void, options?: IReactionOptions,
  ) {
    this._renderer = renderer;
    return autorun(effect, options);
  }

  reaction(expression: (reaction: IReactionPublic) => unknown, effect: (value: unknown, prev: unknown, reaction: IReactionPublic) => void,
    opts?: IReactionOptions | undefined): IReactionDisposer {
    return reaction(expression, effect, opts);
  }

  autorun(effect: (reaction: IReactionPublic) => void, options?: IReactionOptions): IReactionDisposer {
    return autorun(effect, options);
  }

  purge(): void {
    // todo
  }

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

  readonly asyncLibraryMap: { [key: string]: {} } = {};

  readonly libraryMap: { [key: string]: string } = {};

  private _iframe?: HTMLIFrameElement;

  /**
   * {
   *   "title":"BizCharts",
   *   "package":"bizcharts",
   *   "exportName":"bizcharts",
   *   "version":"4.0.14",
   *   "urls":[
   *      "https://g.alicdn.com/code/lib/bizcharts/4.0.14/BizCharts.js"
   *   ],
   *   "library":"BizCharts"
   * }
   * package：String 资源npm包名
   * exportName：String umd包导出名字，用于适配部分物料包define name不一致的问题，例如把BizCharts改成bizcharts，用来兼容物料用define声明的bizcharts
   * version：String 版本号
   * urls：Array 资源cdn地址，必须是umd类型，可以是.js或者.css
   * library：String umd包直接导出的name
   */
  buildLibrary(library?: LibraryItem[]) {
    const _library = library || (this.get('library') as LibraryItem[]);
    const libraryAsset: AssetList = [];
    const libraryExportList: string[] = [];

    if (_library && _library.length) {
      _library.forEach((item) => {
        this.libraryMap[item.package] = item.library;
        if (item.async) {
          this.asyncLibraryMap[item.package] = item;
        }
        if (item.exportName && item.library) {
          libraryExportList.push(
            `Object.defineProperty(window,'${item.exportName}',{get:()=>window.${item.library}});`,
          );
        }
        if (item.editUrls) {
          libraryAsset.push(item.editUrls);
        } else if (item.urls) {
          libraryAsset.push(item.urls);
        }
      });
    }
    libraryAsset.unshift(assetItem(AssetType.JSText, libraryExportList.join('')));

    return libraryAsset;
  }

  rerender() {
    this.designer.refreshComponentMetasMap();
    this.renderer?.rerender?.();
  }

  async mountContentFrame(iframe: HTMLIFrameElement | null) {
    if (!iframe || this._iframe === iframe) {
      return;
    }
    this._iframe = iframe;

    this._contentWindow = iframe.contentWindow!;
    this._contentDocument = this._contentWindow.document;

    const libraryAsset: AssetList = this.buildLibrary();

    const vendors = [
      // required & use once
      assetBundle(
        this.get('environment') ||
          (this.renderEnv === 'rax' ? defaultRaxEnvironment : defaultEnvironment),
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
        this.get('simulatorUrl') ||
          (this.renderEnv === 'rax' ? defaultRaxSimulatorUrl : defaultSimulatorUrl),
        AssetLevel.Runtime,
      ),
    ];

    // wait 准备 iframe 内容、依赖库注入
    const renderer = await createSimulator(this, iframe, vendors);

    // TODO: !!! thinkof reload onloa

    // wait 业务组件被第一次消费，否则会渲染出错
    await this.componentsConsumer.waitFirstConsume();

    // wait 运行时上下文
    await this.injectionConsumer.waitFirstConsume();

    if (Object.keys(this.asyncLibraryMap).length > 0) {
      // 加载异步Library
      await renderer.loadAsyncLibrary(this.asyncLibraryMap);
    }

    // step 5 ready & render
    renderer.run();

    // init events, overlays
    this.viewport.setScrollTarget(this._contentWindow);
    this.setupEvents();

    // bind hotkey & clipboard
    hotkey.mount(this._contentWindow);
    focusTracker.mount(this._contentWindow);
    clipboard.injectCopyPaster(this._contentDocument);

    // TODO: dispose the bindings
  }

  async setupComponents(library) {
    const libraryAsset: AssetList = this.buildLibrary(library);
    await this.renderer.load(libraryAsset);
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

  postEvent(eventName: string, ...data: any[]) {
    this.emitter.emit(eventName, ...data);
  }

  setupDragAndClick() {
    const { designer } = this;
    const doc = this.contentDocument!;

    // TODO: think of lock when edit a node
    // 事件路由
    doc.addEventListener(
      'mousedown',
      (downEvent: MouseEvent) => {
        // fix for popups close logic
        document.dispatchEvent(new Event('mousedown'));
        const documentModel = this.project.currentDocument;
        if (this.liveEditing.editing || !documentModel) {
          return;
        }
        const { selection } = documentModel;
        let isMulti = false;
        if (this.designMode === 'design') {
          isMulti = downEvent.metaKey || downEvent.ctrlKey;
        } else if (!downEvent.metaKey) {
          return;
        }
        // FIXME: dirty fix remove label-for fro liveEditing
        (downEvent.target as HTMLElement).removeAttribute('for');
        const nodeInst = this.getNodeInstanceFromElement(downEvent.target as Element);
        const focusNode = documentModel.focusNode;
        const node = getClosestClickableNode(nodeInst?.node || focusNode, downEvent);
        // 如果找不到可点击的节点, 直接返回
        if (!node) {
          return;
        }
        const rglNode = node?.getParent();
        const isRGLNode = rglNode?.isRGLContainer;
        if (isRGLNode) {
          // 如果拖拽的是磁铁块的右下角handle，则直接跳过
          if (downEvent.target.classList.contains('react-resizable-handle')) return;
          // 禁止多选
          isMulti = false;
          designer.dragon.emitter.emit('rgl.switch', {
            action: 'start',
            rglNode,
          });
        } else {
          // stop response document focus event
          // 禁止原生拖拽
          downEvent.stopPropagation();
          downEvent.preventDefault();
        }
        // if (!node?.isValidComponent()) {
        //   // 对于未注册组件直接返回
        //   return;
        // }
        const isLeftButton = downEvent.which === 1 || downEvent.button === 0;
        const checkSelect = (e: MouseEvent) => {
          doc.removeEventListener('mouseup', checkSelect, true);
          // 取消移动;
          designer.dragon.emitter.emit('rgl.switch', {
            action: 'end',
            rglNode,
          });
          // 鼠标是否移动 ? - 鼠标抖动应该也需要支持选中事件，偶尔点击不能选中，磁帖块移除shaken检测
          if (!isShaken(downEvent, e) || isRGLNode) {
            let { id } = node;
            designer.activeTracker.track({ node, instance: nodeInst?.instance });
            if (isMulti && !node.contains(focusNode) && selection.has(id)) {
              selection.remove(id);
            } else {
              // TODO: 避免选中 Page 组件，默认选中第一个子节点；新增规则 或 判断 Live 模式
              if (node.isPage() && node.getChildren()?.notEmpty() && this.designMode === 'live') {
                const firstChildId = node.getChildren()?.get(0)?.getId();
                if (firstChildId) id = firstChildId;
              }
              selection.select(node.contains(focusNode) ? focusNode.id : id);

              // dirty code should refector
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

        if (isLeftButton && !node.contains(focusNode)) {
          let nodes: Node[] = [node];
          let ignoreUpSelected = false;
          if (isMulti) {
            // multi select mode, directily add
            if (!selection.has(node.id)) {
              designer.activeTracker.track({ node, instance: nodeInst?.instance });
              selection.add(node.id);
              ignoreUpSelected = true;
            }
            selection.remove(focusNode.id);
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
            isRGLNode ? rglNode : undefined,
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

        const customizeIgnoreSelectors = engineConfig.get('customizeIgnoreSelectors');
        // TODO: need more elegant solution to ignore click events of components in designer
        const defaultIgnoreSelectors: any = [
          '.next-input-group',
          '.next-checkbox-group',
          '.next-checkbox-wrapper',
          '.next-date-picker',
          '.next-input',
          '.next-month-picker',
          '.next-number-picker',
          '.next-radio-group',
          '.next-range',
          '.next-range-picker',
          '.next-rating',
          '.next-select',
          '.next-switch',
          '.next-time-picker',
          '.next-upload',
          '.next-year-picker',
          '.next-breadcrumb-item',
          '.next-calendar-header',
          '.next-calendar-table',
          '.editor-container', // 富文本组件
        ];
        const ignoreSelectors = customizeIgnoreSelectors?.(defaultIgnoreSelectors) || defaultIgnoreSelectors;
        const ignoreSelectorsString = ignoreSelectors.join(',');
        // 提供了 customizeIgnoreSelectors 的情况下，忽略 isFormEvent() 判断
        if ((!customizeIgnoreSelectors && isFormEvent(e)) || target?.closest(ignoreSelectorsString)) {
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

  private disableDetecting?: () => void;

  /**
   * 设置悬停处理
   */
  setupDetecting() {
    const doc = this.contentDocument!;
    const { detecting, dragon } = this.designer;
    const hover = (e: MouseEvent) => {
      if (!detecting.enable || this.designMode !== 'design') {
        return;
      }
      const nodeInst = this.getNodeInstanceFromElement(e.target as Element);
      if (nodeInst?.node) {
        let node = nodeInst.node;
        const focusNode = node.document?.focusNode;
        if (node.contains(focusNode)) {
          node = focusNode;
        }
        detecting.capture(node);
      } else {
        detecting.capture(null);
      }
      if (!engineConfig.get('enableMouseEventPropagationInCanvas', false) || dragon.dragging) {
        e.stopPropagation();
      }
    };
    const leave = () => detecting.leave(this.project.currentDocument);

    doc.addEventListener('mouseover', hover, true);
    doc.addEventListener('mouseleave', leave, false);

    // TODO: refactor this line, contains click, mousedown, mousemove
    doc.addEventListener(
      'mousemove',
      (e: Event) => {
        if (!engineConfig.get('enableMouseEventPropagationInCanvas', false) || dragon.dragging) {
          e.stopPropagation();
        }
      },
      true,
    );

    // this.disableDetecting = () => {
    //   detecting.leave(this.project.currentDocument);
    //   doc.removeEventListener('mouseover', hover, true);
    //   doc.removeEventListener('mouseleave', leave, false);
    //   this.disableDetecting = undefined;
    // };
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
        const focusNode = this.project.currentDocument?.focusNode;
        const node = nodeInst.node || focusNode;
        if (!node || isLowCodeComponent(node)) {
          return;
        }

        const rootElement = this.findDOMNodes(
          nodeInst.instance,
          node.componentMeta.rootSelector,
        )?.find(
          (item) =>
            // 可能是 [null];
            item && item.contains(targetElement),
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
    return false;
    // if (suspended) {
    //   /*
    //   if (this.disableDetecting) {
    //     this.disableDetecting();
    //   }
    //   */
    //   // sleep some autorun reaction
    // } else {
    //   // weekup some autorun reaction
    //   /*
    //   if (!this.disableDetecting) {
    //     this.setupDetecting();
    //   }
    //   */
    // }
  }

  setupContextMenu() {
    const doc = this.contentDocument!;
    doc.addEventListener('contextmenu', (e: MouseEvent) => {
      const targetElement = e.target as HTMLElement;
      const nodeInst = this.getNodeInstanceFromElement(targetElement);
      if (!nodeInst) {
        return;
      }
      const node = nodeInst.node || this.project.currentDocument?.focusNode;
      if (!node) {
        return;
      }

      // dirty code should refector
      const editor = this.designer?.editor;
      const npm = node?.componentMeta?.npm;
      const selected =
        [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
        node?.componentMeta?.componentName ||
        '';
      editor?.emit('designer.builtinSimulator.contextmenu', {
        selected,
        ...nodeInst,
        instanceRect: this.computeComponentInstanceRect(nodeInst.instance),
        originalEvent: e,
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
    return null;
    // return this.renderer?.createComponent(schema) || null;
  }

  @obx private instancesMap: {
    [docId: string]: Map<string, ComponentInstance[]>;
  } = {};
  setInstance(docId: string, id: string, instances: ComponentInstance[] | null) {
    if (!hasOwnProperty(this.instancesMap, docId)) {
      this.instancesMap[docId] = new Map();
    }
    if (instances == null) {
      this.instancesMap[docId].delete(id);
    } else {
      this.instancesMap[docId].set(id, instances.slice());
    }
  }

  /**
   * @see ISimulator
   */
  getComponentInstances(node: Node, context?: NodeInstance): ComponentInstance[] | null {
    const docId = node.document.id;

    const instances = this.instancesMap[docId]?.get(node.id) || null;
    if (!instances || !context) {
      return instances;
    }

    // filter with context
    return instances.filter((instance) => {
      return this.getClosestNodeInstance(instance, context.nodeId)?.instance === context.instance;
    });
  }

  /**
   * @see ISimulator
   */
  getComponentContext(/* node: Node */): any {
    throw new Error('Method not implemented.');
  }

  /**
   * @see ISimulator
   */
  getClosestNodeInstance(
    from: ComponentInstance,
    specId?: string,
  ): NodeInstance<ComponentInstance> | null {
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
    let _computed = false;
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
        _computed = true;
      }
      if (rect.top < last.y) {
        last.y = rect.top;
        _computed = true;
      }
      if (rect.right > last.r) {
        last.r = rect.right;
        _computed = true;
      }
      if (rect.bottom > last.b) {
        last.b = rect.bottom;
        _computed = true;
      }
    }

    if (last) {
      const r: any = new DOMRect(last.x, last.y, last.r - last.x, last.b - last.y);
      r.elements = elements;
      r.computed = _computed;
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
    const { docId } = nodeIntance;
    const doc = this.project.getDocument(docId)!;
    const node = doc.getNode(nodeIntance.nodeId);
    return {
      ...nodeIntance,
      node,
    };
  }

  private tryScrollAgain: number | null = null;

  /**
   * @see ISimulator
   */
  /* istanbul ignore next */
  scrollToNode(node: Node, detail?: any /* , tryTimes = 0 */) {
    this.tryScrollAgain = null;
    if (this.sensing) {
      // active sensor
      return;
    }

    const opt: any = {};
    let scroll = false;

    const componentInstance = this.getComponentInstances(detail?.near?.node || node)?.[0];
    if (!componentInstance) return;
    const domNode = this.findDOMNodes(componentInstance)?.[0] as Element;
    if (!domNode) return;
    if (isElementNode(domNode) && !isDOMNodeVisible(domNode, this.viewport)) {
      const { left, top } = domNode.getBoundingClientRect();
      const { scrollTop = 0, scrollLeft = 0 } = this.contentDocument?.documentElement || {};
      opt.left = left + scrollLeft;
      opt.top = top + scrollTop;
      scroll = true;
    }
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
    } */

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
      if (!isNaN(e.canvasX!) && !isNaN(e.canvasY!)) {
        e.target = this.contentDocument?.elementFromPoint(e.canvasX!, e.canvasY!);
      }
    }

    // 事件已订正
    e.fixed = true;
    return e;
  }

  /**
   * @see ISensor
   */
  isEnter(e: LocateEvent): boolean {
    const rect = this.viewport.bounds;
    return (
      e.globalY >= rect.top &&
      e.globalY <= rect.bottom &&
      e.globalX >= rect.left &&
      e.globalX <= rect.right
    );
  }

  private sensing = false;

  /**
   * @see ISensor
   */
  deactiveSensor() {
    this.sensing = false;
    this.scroller.cancel();
  }

  // ========= drag location logic: helper for locate ==========

  /**
   * @see ISensor
   */
  locate(e: LocateEvent): any {
    const { dragObject } = e;
    const { nodes } = dragObject as DragNodeObject;

    const operationalNodes = nodes?.filter((node) => {
      const onMoveHook = node.componentMeta?.getMetadata()?.configure.advanced?.callbacks?.onMoveHook;
      const canMove = onMoveHook && typeof onMoveHook === 'function' ? onMoveHook(node.internalToShellNode()) : true;

      return canMove;
    });

    if (nodes && (!operationalNodes || operationalNodes.length === 0)) {
      return;
    }

    this.sensing = true;
    this.scroller.scrolling(e);
    const document = this.project.currentDocument;
    if (!document) {
      return null;
    }
    const dropContainer = this.getDropContainer(e);
    const childWhitelist = dropContainer?.container?.componentMeta?.childWhitelist;
    const lockedNode = getClosestNode(dropContainer?.container as Node, (node) => node.isLocked);
    if (lockedNode) return null;
    if (
      !dropContainer ||
      (nodes && typeof childWhitelist === 'function' && !childWhitelist(operationalNodes[0]))
    ) {
      return null;
    }

    if (isLocationData(dropContainer)) {
      return this.designer.createLocation(dropContainer);
    }

    const { container, instance: containerInstance } = dropContainer;

    const edge = this.computeComponentInstanceRect(
      containerInstance,
      container.componentMeta.rootSelector,
    );

    if (!edge) {
      return null;
    }

    const { children } = container;

    const detail: LocationChildrenDetail = {
      type: LocationDetailType.Children,
      index: 0,
      edge,
    };

    const locationData = {
      target: container as ParentalNode,
      detail,
      source: `simulator${document.id}`,
      event: e,
    };

    if (
      e.dragObject &&
      e.dragObject.nodes &&
      e.dragObject.nodes.length &&
      e.dragObject.nodes[0].componentMeta.isModal
    ) {
      return this.designer.createLocation({
        target: document.focusNode,
        detail,
        source: `simulator${document.id}`,
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
          ? instances.find(
            (_inst) => this.getClosestNodeInstance(_inst, container.id)?.instance === containerInstance,
          )
          : instances[0]
        : null;
      const rect = inst
        ? this.computeComponentInstanceRect(inst, node.componentMeta.rootSelector)
        : null;

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
          const { nearAfter } = edgeDistance;
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
  getDropContainer(e: LocateEvent): DropContainer | null {
    const { target, dragObject } = e;
    const isAny = isDragAnyObject(dragObject);
    const document = this.project.currentDocument!;
    const { currentRoot } = document;
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

    // TODO: use spec container to accept specialData
    if (isAny) {
      // will return locationData
      return null;
    }

    // get common parent, avoid drop container contains by dragObject
    const drillDownExcludes = new Set<Node>();
    if (isDragNodeObject(dragObject)) {
      const { nodes } = dragObject;
      let i = nodes.length;
      let p: any = container;
      while (i-- > 0) {
        if (contains(nodes[i], p)) {
          p = nodes[i].parent;
        }
      }
      if (p !== container) {
        container = p || document.focusNode;
        drillDownExcludes.add(container);
      }
    }

    let instance: any;
    if (nodeInstance) {
      if (nodeInstance.node === container) {
        instance = nodeInstance.instance;
      } else {
        instance = this.getClosestNodeInstance(
          nodeInstance.instance as any,
          container.id,
        )?.instance;
      }
    } else {
      instance = this.getComponentInstances(container)?.[0];
    }

    let dropContainer: DropContainer = {
      container: container as any,
      instance,
    };

    let res: any;
    let upward: DropContainer | null = null;
    while (container) {
      res = this.handleAccept(dropContainer, e);
      // if (isLocationData(res)) {
      //   return res;
      // }
      if (res === true) {
        return dropContainer;
      }
      if (!res) {
        drillDownExcludes.add(container);
        if (upward) {
          dropContainer = upward;
          container = dropContainer.container;
          upward = null;
        } else if (container.parent) {
          container = container.parent;
          instance = this.getClosestNodeInstance(dropContainer.instance, container.id)?.instance;
          dropContainer = {
            container: container as ParentalNode,
            instance,
          };
        } else {
          return null;
        }
      } /* else if (res === DRILL_DOWN) {
        if (!upward) {
          container = container.parent;
          instance = this.getClosestNodeInstance(dropContainer.instance, container.id)?.instance;
          upward = {
            container,
            instance
          };
        }
        dropContainer = this.getNearByContainer(dropContainer, drillDownExcludes, e);
        if (!dropContainer) {
          dropContainer = upward;
          upward = null;
        }
      } else if (isNode(res)) {
        // TODO:
      } */
    }
    return null;
  }

  isAcceptable(/* container: ParentalNode */): boolean {
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
  handleAccept({ container, instance }: DropContainer, e: LocateEvent): boolean {
    const { dragObject } = e;
    const document = this.currentDocument!;
    const focusNode = document.focusNode;
    if (isRootNode(container) || container.contains(focusNode)) {
      return document.checkDropTarget(focusNode, dragObject as any);
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
    return document.checkNesting(container, dragObject as any);
  }

  /**
   * 查找邻近容器
   */
  getNearByContainer(
    { container, instance }: DropContainer,
    drillDownExcludes: Set<Node>,
    e: LocateEvent,
  ) {
    const { children } = container;
    const document = this.project.currentDocument!;
    if (!children || children.isEmpty()) {
      return null;
    }

    const nearDistance: any = null;
    const nearBy: any = null;
    for (let i = 0, l = children.size; i < l; i++) {
      let child = children.get(i);

      if (!child) {
        continue;
      }
      if (child.conditionGroup) {
        const bn = child.conditionGroup;
        i = bn.index + bn.length - 1;
        child = bn.visibleNode;
      }
      if (!child.isParental() || drillDownExcludes.has(child)) {
        continue;
      }
      // TODO:
      this.findDOMNodes(instance);
      this.getComponentInstances(child);
      const rect = this.computeRect(child);
      if (!rect) {
        continue;
      }

      /*
      if (isPointInRect(e, rect)) {
        return child;
      }

      const distance = distanceToRect(e, rect);
      if (nearDistance === null || distance < nearDistance) {
        nearDistance = distance;
        nearBy = child;
      } */
    }

    return nearBy;
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
