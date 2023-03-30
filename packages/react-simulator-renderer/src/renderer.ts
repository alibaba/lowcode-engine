import React, { createElement, ReactInstance } from 'react';
import { render as reactRender } from 'react-dom';
import { host } from './host';
import SimulatorRendererView from './renderer-view';
import { computed, observable as obx, untracked, makeObservable, configure } from 'mobx';
import { getClientRects } from './utils/get-client-rects';
import { reactFindDOMNodes, getReactInternalFiber } from './utils/react-find-dom-nodes';
import {
  Asset,
  isElement,
  cursor,
  setNativeSelection,
  buildComponents,
  getSubComponent,
  compatibleLegaoSchema,
  isPlainObject,
  AssetLoader,
  getProjectUtils,
} from '@alilc/lowcode-utils';
import { IPublicTypeComponentSchema, IPublicEnumTransformStage, IPublicTypeNodeInstance, IPublicTypeProjectSchema } from '@alilc/lowcode-types';
// just use types
import { BuiltinSimulatorRenderer, Component, IDocumentModel, INode } from '@alilc/lowcode-designer';
import LowCodeRenderer from '@alilc/lowcode-react-renderer';
import { createMemoryHistory, MemoryHistory } from 'history';
import Slot from './builtin-components/slot';
import Leaf from './builtin-components/leaf';
import { withQueryParams, parseQuery } from './utils/url';
import { merge } from 'lodash';

const loader = new AssetLoader();
configure({ enforceActions: 'never' });

export class DocumentInstance {
  instancesMap = new Map<string, ReactInstance[]>();

  get schema(): any {
    return this.document.export(IPublicEnumTransformStage.Render);
  }

  private disposeFunctions: Array<() => void> = [];

  @obx.ref private _components: any = {};

  @computed get components(): object {
    // 根据 device 选择不同组件，进行响应式
    // 更好的做法是，根据 device 选择加载不同的组件资源，甚至是 simulatorUrl
    return this._components;
  }

  // context from: utils、constants、history、location、match
  @obx.ref private _appContext = {};

  @computed get context(): any {
    return this._appContext;
  }

  @obx.ref private _designMode = 'design';

  @computed get designMode(): any {
    return this._designMode;
  }

  @obx.ref private _requestHandlersMap = null;

  @computed get requestHandlersMap(): any {
    return this._requestHandlersMap;
  }

  @obx.ref private _device = 'default';

  @computed get device() {
    return this._device;
  }

  @obx.ref private _componentsMap = {};

  @computed get componentsMap(): any {
    return this._componentsMap;
  }

  @computed get suspended(): any {
    return false;
  }

  @computed get scope(): any {
    return null;
  }

  get path(): string {
    return `/${this.document.fileName}`;
  }

  get id() {
    return this.document.id;
  }

  constructor(readonly container: SimulatorRendererContainer, readonly document: IDocumentModel) {
    makeObservable(this);
  }

  private unmountInstance(id: string, instance: ReactInstance) {
    const instances = this.instancesMap.get(id);
    if (instances) {
      const i = instances.indexOf(instance);
      if (i > -1) {
        instances.splice(i, 1);
        host.setInstance(this.document.id, id, instances);
      }
    }
  }

  mountInstance(id: string, instance: ReactInstance | null) {
    const docId = this.document.id;
    const { instancesMap } = this;
    if (instance == null) {
      let instances = this.instancesMap.get(id);
      if (instances) {
        instances = instances.filter(checkInstanceMounted);
        if (instances.length > 0) {
          instancesMap.set(id, instances);
          host.setInstance(this.document.id, id, instances);
        } else {
          instancesMap.delete(id);
          host.setInstance(this.document.id, id, null);
        }
      }
      return;
    }
    const unmountInstance = this.unmountInstance.bind(this);
    const origId = (instance as any)[SYMBOL_VNID];
    if (origId && origId !== id) {
      // 另外一个节点的 instance 在此被复用了，需要从原来地方卸载
      unmountInstance(origId, instance);
    }
    if (isElement(instance)) {
      cacheReactKey(instance);
    } else if (origId !== id) {
      // 涵盖 origId == null || origId !== id 的情况
      let origUnmount: any = instance.componentWillUnmount;
      if (origUnmount && origUnmount.origUnmount) {
        origUnmount = origUnmount.origUnmount;
      }
      // hack! delete instance from map
      const newUnmount = function (this: any) {
        unmountInstance(id, instance);
        origUnmount && origUnmount.call(this);
      };
      (newUnmount as any).origUnmount = origUnmount;
      instance.componentWillUnmount = newUnmount;
    }

    (instance as any)[SYMBOL_VNID] = id;
    (instance as any)[SYMBOL_VDID] = docId;
    let instances = this.instancesMap.get(id);
    if (instances) {
      const l = instances.length;
      instances = instances.filter(checkInstanceMounted);
      let updated = instances.length !== l;
      if (!instances.includes(instance)) {
        instances.push(instance);
        updated = true;
      }
      if (!updated) {
        return;
      }
    } else {
      instances = [instance];
    }
    instancesMap.set(id, instances);
    host.setInstance(this.document.id, id, instances);
  }

  mountContext() {
  }

  getNode(id: string): INode | null {
    return this.document.getNode(id);
  }

  dispose() {
    this.disposeFunctions.forEach(fn => fn());
    this.instancesMap = new Map();
  }
}

export class SimulatorRendererContainer implements BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer = true;
  private disposeFunctions: Array<() => void> = [];
  readonly history: MemoryHistory;

  @obx.ref private _documentInstances: DocumentInstance[] = [];
  private _requestHandlersMap: any;
  get documentInstances() {
    return this._documentInstances;
  }

  @obx private _layout: any = null;

  @computed get layout(): any {
    // TODO: parse layout Component
    return this._layout;
  }

  set layout(value: any) {
    this._layout = value;
  }

  private _libraryMap: { [key: string]: string } = {};

  private _components: Record<string, React.FC | React.ComponentClass> | null = {};

  get components(): Record<string, React.FC | React.ComponentClass> {
    // 根据 device 选择不同组件，进行响应式
    // 更好的做法是，根据 device 选择加载不同的组件资源，甚至是 simulatorUrl
    return this._components || {};
  }
  // context from: utils、constants、history、location、match
  @obx.ref private _appContext: any = {};
  @computed get context(): any {
    return this._appContext;
  }
  @obx.ref private _designMode: string = 'design';
  @computed get designMode(): any {
    return this._designMode;
  }
  @obx.ref private _device: string = 'default';
  @computed get device() {
    return this._device;
  }
  @obx.ref private _locale: string | undefined = undefined;
  @computed get locale() {
    return this._locale;
  }
  @obx.ref private _componentsMap = {};
  @computed get componentsMap(): any {
    return this._componentsMap;
  }

  /**
   * 是否为画布自动渲染
   */
  autoRender = true;

  /**
   * 画布是否自动监听事件来重绘节点
   */
  autoRepaintNode = true;

  private _running = false;

  constructor() {
    makeObservable(this);
    this.autoRender = host.autoRender;

    this.disposeFunctions.push(host.connect(this, () => {
      // sync layout config
      this._layout = host.project.get('config').layout;

      // todo: split with others, not all should recompute
      if (this._libraryMap !== host.libraryMap
        || this._componentsMap !== host.designer.componentsMap) {
        this._libraryMap = host.libraryMap || {};
        this._componentsMap = host.designer.componentsMap;
        this.buildComponents();
      }

      // sync designMode
      this._designMode = host.designMode;

      this._locale = host.locale;

      // sync requestHandlersMap
      this._requestHandlersMap = host.requestHandlersMap;

      // sync device
      this._device = host.device;
    }));
    const documentInstanceMap = new Map<string, DocumentInstance>();
    let initialEntry = '/';
    let firstRun = true;
    this.disposeFunctions.push(host.autorun(() => {
      this._documentInstances = host.project.documents.map((doc) => {
        let inst = documentInstanceMap.get(doc.id);
        if (!inst) {
          inst = new DocumentInstance(this, doc);
          documentInstanceMap.set(doc.id, inst);
        }
        return inst;
      });
      const path = host.project.currentDocument
        ? documentInstanceMap.get(host.project.currentDocument.id)!.path
        : '/';
      if (firstRun) {
        initialEntry = path;
        firstRun = false;
      } else if (this.history.location.pathname !== path) {
        this.history.replace(path);
      }
    }));
    const history = createMemoryHistory({
      initialEntries: [initialEntry],
    });
    this.history = history;
    history.listen((location) => {
      const docId = location.pathname.slice(1);
      docId && host.project.open(docId);
    });
    host.componentsConsumer.consume(async (componentsAsset) => {
      if (componentsAsset) {
        await this.load(componentsAsset);
        this.buildComponents();
      }
    });
    this._appContext = {
      utils: {
        router: {
          push(path: string, params?: object) {
            history.push(withQueryParams(path, params));
          },
          replace(path: string, params?: object) {
            history.replace(withQueryParams(path, params));
          },
        },
        legaoBuiltins: {
          getUrlParams() {
            const { search } = history.location;
            return parseQuery(search);
          },
        },
        i18n: {
          setLocale: (loc: string) => {
            this._appContext.utils.i18n.currentLocale = loc;
            this._locale = loc;
          },
          currentLocale: this.locale,
          messages: {},
        },
        ...getProjectUtils(this._libraryMap, host.get('utilsMetadata')),
      },
      constants: {},
      requestHandlersMap: this._requestHandlersMap,
    };

    host.injectionConsumer.consume((data) => {
      // TODO: sync utils, i18n, contants,... config
      const newCtx = {
        ...this._appContext,
      };
      merge(newCtx, data.appHelper || {});
      this._appContext = newCtx;
    });

    host.i18nConsumer.consume((data) => {
      const newCtx = {
        ...this._appContext,
      };
      newCtx.utils.i18n.messages = data || {};
      this._appContext = newCtx;
    });
  }

  private buildComponents() {
    this._components = buildComponents(
        this._libraryMap,
        this._componentsMap,
        this.createComponent.bind(this),
      );
    this._components = {
      ...builtinComponents,
      ...this._components,
    };
  }

  /**
   * 加载资源
   */
  load(asset: Asset): Promise<any> {
    return loader.load(asset);
  }

  async loadAsyncLibrary(asyncLibraryMap: Record<string, any>) {
    await loader.loadAsyncLibrary(asyncLibraryMap);
    this.buildComponents();
  }

  getComponent(componentName: string) {
    const paths = componentName.split('.');
    const subs: string[] = [];

    while (true) {
      const component = this._components?.[componentName];
      if (component) {
        return getSubComponent(component, subs);
      }

      const sub = paths.pop();
      if (!sub) {
        return null;
      }
      subs.unshift(sub);
      componentName = paths.join('.');
    }
  }

  getClosestNodeInstance(from: ReactInstance, nodeId?: string): IPublicTypeNodeInstance<ReactInstance> | null {
    return getClosestNodeInstance(from, nodeId);
  }

  findDOMNodes(instance: ReactInstance): Array<Element | Text> | null {
    return reactFindDOMNodes(instance);
  }

  getClientRects(element: Element | Text) {
    return getClientRects(element);
  }

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

  createComponent(schema: IPublicTypeProjectSchema<IPublicTypeComponentSchema>): Component | null {
    const _schema: IPublicTypeProjectSchema<IPublicTypeComponentSchema> = {
      ...schema,
      componentsTree: schema.componentsTree.map(compatibleLegaoSchema),
    };

    const componentsTreeSchema = _schema.componentsTree[0];

    if (componentsTreeSchema.componentName === 'Component' && componentsTreeSchema.css) {
      const doc = window.document;
      const s = doc.createElement('style');
      s.setAttribute('type', 'text/css');
      s.setAttribute('id', `Component-${componentsTreeSchema.id || ''}`);
      s.appendChild(doc.createTextNode(componentsTreeSchema.css || ''));
      doc.getElementsByTagName('head')[0].appendChild(s);
    }

    const renderer = this;

    class LowCodeComp extends React.Component<any, any> {
      render() {
        const extraProps = getLowCodeComponentProps(this.props);
        return createElement(LowCodeRenderer, {
          ...extraProps, // 防止覆盖下面内置属性
          // 使用 _schema 为了使低代码组件在页面设计中使用变量，同 react 组件使用效果一致
          schema: componentsTreeSchema,
          components: renderer.components,
          designMode: '',
          locale: renderer.locale,
          messages: _schema.i18n || {},
          device: renderer.device,
          appHelper: renderer.context,
          rendererName: 'LowCodeRenderer',
          thisRequiredInJSE: host.thisRequiredInJSE,
          faultComponent: host.faultComponent,
          faultComponentMap: host.faultComponentMap,
          customCreateElement: (Comp: any, props: any, children: any) => {
            const componentMeta = host.currentDocument?.getComponentMeta(Comp.displayName);
            if (componentMeta?.isModal) {
              return null;
            }

            const { __id, __designMode, ...viewProps } = props;
            // mock _leaf，减少性能开销
            const _leaf = {
              isEmpty: () => false,
              isMock: true,
            };
            viewProps._leaf = _leaf;
            return createElement(Comp, viewProps, children);
          },
        });
      }
    }

    return LowCodeComp;
  }

  run() {
    if (this._running) {
      return;
    }
    this._running = true;
    const containerId = 'app';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      document.body.appendChild(container);
      container.id = containerId;
    }

    // ==== compatible vision
    document.documentElement.classList.add('engine-page');
    document.body.classList.add('engine-document'); // important! Stylesheet.invoke depends

    reactRender(createElement(SimulatorRendererView, { rendererContainer: this }), container);
    host.project.setRendererReady(this);
  }

  /**
   * 刷新渲染器
   */
  rerender() {
    this.autoRender = true;
    // TODO: 不太优雅
    this._appContext = { ...this._appContext };
  }

  stopAutoRepaintNode() {
    this.autoRepaintNode = false;
  }

  enableAutoRepaintNode() {
    this.autoRepaintNode = true;
  }

  dispose() {
    this.disposeFunctions.forEach((fn) => fn());
    this.documentInstances.forEach((docInst) => docInst.dispose());
    untracked(() => {
      this._componentsMap = {};
      this._components = null;
      this._appContext = null;
    });
  }
}

// Slot/Leaf and Fragment|FunctionComponent polyfill(ref)

const builtinComponents = {
  Slot,
  Leaf,
};

let REACT_KEY = '';
function cacheReactKey(el: Element): Element {
  if (REACT_KEY !== '') {
    return el;
  }
  // react17 采用 __reactFiber 开头
  REACT_KEY = Object.keys(el).find(
    (key) => key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$'),
  ) || '';
  if (!REACT_KEY && (el as HTMLElement).parentElement) {
    return cacheReactKey((el as HTMLElement).parentElement!);
  }
  return el;
}

const SYMBOL_VNID = Symbol('_LCNodeId');
const SYMBOL_VDID = Symbol('_LCDocId');

function getClosestNodeInstance(
    from: ReactInstance,
    specId?: string,
  ): IPublicTypeNodeInstance<ReactInstance> | null {
  let el: any = from;
  if (el) {
    if (isElement(el)) {
      el = cacheReactKey(el);
    } else {
      return getNodeInstance(getReactInternalFiber(el), specId);
    }
  }
  while (el) {
    if (SYMBOL_VNID in el) {
      const nodeId = el[SYMBOL_VNID];
      const docId = el[SYMBOL_VDID];
      if (!specId || specId === nodeId) {
        return {
          docId,
          nodeId,
          instance: el,
        };
      }
    }
    // get fiberNode from element
    if (el[REACT_KEY]) {
      return getNodeInstance(el[REACT_KEY], specId);
    }
    el = el.parentElement;
  }
  return null;
}

function getNodeInstance(fiberNode: any, specId?: string): IPublicTypeNodeInstance<ReactInstance> | null {
  const instance = fiberNode?.stateNode;
  if (instance && SYMBOL_VNID in instance) {
    const nodeId = instance[SYMBOL_VNID];
    const docId = instance[SYMBOL_VDID];
    if (!specId || specId === nodeId) {
      return {
        docId,
        nodeId,
        instance,
      };
    }
  }
  if (!instance && !fiberNode?.return) return null;
  return getNodeInstance(fiberNode?.return);
}

function checkInstanceMounted(instance: any): boolean {
  if (isElement(instance)) {
    return instance.parentElement != null;
  }
  return true;
}

function getLowCodeComponentProps(props: any) {
  if (!props || !isPlainObject(props)) {
    return props;
  }
  const newProps: any = {};
  Object.keys(props).forEach((k) => {
    if (['children', 'componentId', '__designMode', '_componentName', '_leaf'].includes(k)) {
      return;
    }
    newProps[k] = props[k];
  });
  newProps['componentName'] = props['_componentName'];
  return newProps;
}

export default new SimulatorRendererContainer();
