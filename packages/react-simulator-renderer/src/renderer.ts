import React, { createElement, ReactInstance } from 'react';
import { render as reactRender } from 'react-dom';
import { host } from './host';
import SimulatorRendererView from './renderer-view';
import { computed, obx } from '@recore/obx';
import { getClientRects } from './utils/get-client-rects';
import { reactFindDOMNodes, FIBER_KEY } from './utils/react-find-dom-nodes';
import {
  Asset,
  isElement,
  cursor,
  setNativeSelection,
  buildComponents,
  getSubComponent,
  compatibleLegaoSchema,
  isPlainObject,
} from '@ali/lowcode-utils';
import { RootSchema, ComponentSchema, TransformStage, NodeSchema } from '@ali/lowcode-types';
// import { isESModule, isElement, acceptsRef, wrapReactClass, cursor, setNativeSelection } from '@ali/lowcode-utils';
// import { RootSchema, NpmInfo, ComponentSchema, TransformStage, NodeSchema } from '@ali/lowcode-types';
// just use types
import { BuiltinSimulatorRenderer, NodeInstance, Component, DocumentModel } from '@ali/lowcode-designer';
import LowCodeRenderer from '@ali/lowcode-react-renderer';
import { createMemoryHistory, MemoryHistory } from 'history';
import Slot from './builtin-components/slot';
import Leaf from './builtin-components/leaf';
import { withQueryParams, parseQuery } from './utils/url';

export class DocumentInstance {
  private instancesMap = new Map<string, ReactInstance[]>();

  @obx.ref private _schema?: RootSchema;
  @computed get schema(): any {
    return this._schema;
  }

  private dispose?: () => void;

  constructor(readonly container: SimulatorRendererContainer, readonly document: DocumentModel) {
    this.dispose = host.autorun(() => {
      // sync schema
      this._schema = document.export(1);
    });
  }

  // private _libraryMap: { [key: string]: string } = {};
  // private buildComponents() {
  //   this._components = {
  //     ...builtinComponents,
  //     ...buildComponents(this._libraryMap, this._componentsMap),
  //   };
  // }
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
    return `/${ this.document.fileName}`;
  }

  get id() {
    return this.document.id;
  }

  private unmountIntance(id: string, instance: ReactInstance) {
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
    const unmountIntance = this.unmountIntance.bind(this);
    const origId = (instance as any)[SYMBOL_VNID];
    if (origId && origId !== id) {
      // 另外一个节点的 instance 在此被复用了，需要从原来地方卸载
      unmountIntance(origId, instance);
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
        unmountIntance(id, instance);
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

  mountContext(docId: string, id: string, ctx: object) {
    // this.ctxMap.set(id, ctx);
  }

  getNode(id: string): Node | null {
    return this.document.getNode(id);
  }
}

export class SimulatorRendererContainer implements BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer = true;
  private dispose?: () => void;
  readonly history: MemoryHistory;

  @obx.ref private _documentInstances: DocumentInstance[] = [];
  get documentInstances() {
    return this._documentInstances;
  }

  constructor() {
    this.dispose = host.connect(this, () => {
      // sync layout config
      this._layout = host.project.get('config').layout;

      // todo: split with others, not all should recompute
      if (this._libraryMap !== host.libraryMap || this._componentsMap !== host.designer.componentsMap) {
        this._libraryMap = host.libraryMap || {};
        this._componentsMap = host.designer.componentsMap;
        // 需要注意的是，autorun 依赖收集的是同步执行的代码，所以 await / promise / callback 里的变量不会被收集依赖
        // 此例中，host.designer.componentsMap 是需要被收集依赖的，否则无法响应式
        // await host.waitForCurrentDocument();
        this.buildComponents();
      }

      // sync designMode
      this._designMode = host.designMode;

      this._locale = host.locale;

      // sync requestHandlersMap
      this._requestHandlersMap = host.requestHandlersMap;

      // sync device
      this._device = host.device;
    });
    const documentInstanceMap = new Map<string, DocumentInstance>();
    let initialEntry = '/';
    host.autorun(({ firstRun }) => {
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
      } else if (this.history.location.pathname !== path) {
        this.history.replace(path);
      }
    });
    const history = createMemoryHistory({
      initialEntries: [initialEntry],
    });
    this.history = history;
    history.listen((location, action) => {
      host.project.open(location.pathname.substr(1));
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
      },
      constants: {},
      requestHandlersMap: this._requestHandlersMap,
    };
    host.injectionConsumer.consume((data) => {
      // TODO: sync utils, i18n, contants,... config
      const newCtx = {
        ...this._appContext,
      };
      newCtx.utils.i18n.messages = data.i18n || {};
      this._appContext = newCtx;
    });
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

  private buildComponents() {
    // TODO: remove this.createComponent
    this._components = buildComponents(this._libraryMap, this._componentsMap, this.createComponent.bind(this));
    this._components = {
      ...builtinComponents,
      ...this._components,
    };
  }
  @obx.ref private _components: any = {};

  @computed get components(): object {
    // 根据 device 选择不同组件，进行响应式
    // 更好的做法是，根据 device 选择加载不同的组件资源，甚至是 simulatorUrl
    return this._components;
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
   * 加载资源
   */
  // load(asset: Asset): Promise<any> {
  //   return loader.load(asset);
  // }

  getComponent(componentName: string) {
    const paths = componentName.split('.');
    const subs: string[] = [];

    while (true) {
      const component = this._components[componentName];
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

  getClosestNodeInstance(from: ReactInstance, nodeId?: string): NodeInstance<ReactInstance> | null {
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

  createComponent(schema: NodeSchema): Component | null {
    const _schema: any = {
      ...compatibleLegaoSchema(schema),
    };
    _schema.methods = {};
    _schema.lifeCycles = {};

    if (schema.componentName === 'Component' && (schema as ComponentSchema).css) {
      const doc = window.document;
      const s = doc.createElement('style');
      s.setAttribute('type', 'text/css');
      s.setAttribute('id', `Component-${schema.id || ''}`);
      s.appendChild(doc.createTextNode((schema as ComponentSchema).css || ''));
      doc.getElementsByTagName('head')[0].appendChild(s);
    }

    const renderer = this;
    const { componentsMap: components } = renderer;

    class LowCodeComp extends React.Component {
      render() {
        const extraProps = getLowCodeComponentProps(this.props);
        // @ts-ignore
        return createElement(LowCodeRenderer, {
          ...extraProps, // 防止覆盖下面内置属性
          schema: _schema,
          components,
          designMode: renderer.designMode,
          device: renderer.device,
          appHelper: renderer.context,
          customCreateElement: (Comp: any, props: any, children: any) => {
            const componentMeta = host.currentDocument?.getComponentMeta(Comp.displayName);
            if (componentMeta?.isModal) {
              return null;
            }

            const { __id, __designMode, ...viewProps } = props;
            // mock _leaf，减少性能开销
            const _leaf = {
              isEmpty: () => false,
            };
            viewProps._leaf = _leaf;
            return createElement(Comp, viewProps, children);
          },
        });
      }
    }

    return LowCodeComp;
  }

  private _running = false;

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

    // ==== compatiable vision
    document.documentElement.classList.add('engine-page');
    document.body.classList.add('engine-document'); // important! Stylesheet.invoke depends

    reactRender(createElement(SimulatorRendererView, { rendererContainer: this }), container);
    host.project.setRendererReady(this);
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
  REACT_KEY = Object.keys(el).find((key) => key.startsWith('__reactInternalInstance$')) || '';
  if (!REACT_KEY && (el as HTMLElement).parentElement) {
    return cacheReactKey((el as HTMLElement).parentElement!);
  }
  return el;
}

const SYMBOL_VNID = Symbol('_LCNodeId');
const SYMBOL_VDID = Symbol('_LCDocId');

function getClosestNodeInstance(from: ReactInstance, specId?: string): NodeInstance<ReactInstance> | null {
  let el: any = from;
  if (el) {
    if (isElement(el)) {
      el = cacheReactKey(el);
    } else {
      return getNodeInstance(el[FIBER_KEY], specId);
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

function getNodeInstance(fiberNode: any, specId?: string): NodeInstance<ReactInstance> | null {
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
  Object.keys(props).forEach(k => {
    if (['children', 'componentId', '__designMode', '_componentName', '_leaf'].includes(k)) {
      return;
    }
    newProps[k] = props[k];
  });
  return newProps;
}

export default new SimulatorRendererContainer();
