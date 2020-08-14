import { BuiltinSimulatorRenderer, NodeInstance, Component, DocumentModel } from '@ali/lowcode-designer';
// @ts-ignore
import { shared, render as raxRender, createElement, ComponentType } from 'rax';
import DriverUniversal from 'driver-universal';
import { computed, obx } from '@recore/obx';
import { RootSchema, NpmInfo, ComponentSchema } from '@ali/lowcode-types';
import { Asset, isReactComponent, isESModule, setNativeSelection, cursor, isElement } from '@ali/lowcode-utils';

import SimulatorRendererView from './renderer-view';
import { raxFindDOMNodes } from './utils/find-dom-nodes';
import { getClientRects } from './utils/get-client-rects';
import loader from './utils/loader';

import Leaf from './builtin-components/leaf';
import Slot from './builtin-components/slot';

import { host } from './host';
import { EventEmitter } from 'events';

const { Instance } = shared;

export interface LibraryMap {
  [key: string]: string;
}

const SYMBOL_VNID = Symbol('_LCNodeId');
const SYMBOL_VDID = Symbol('_LCDocId');

function accessLibrary(library: string | object) {
  if (typeof library !== 'string') {
    return library;
  }

  return (window as any)[library];
}

// Slot/Leaf and Fragment|FunctionComponent polyfill(ref)

const builtinComponents = {
  Slot,
  Leaf,
};

function buildComponents(libraryMap: LibraryMap,
  componentsMap: { [componentName: string]: NpmInfo | ComponentType<any> | ComponentSchema },
  createComponent: (schema: ComponentSchema) => Component | null) {
  const components: any = {
    ...builtinComponents,
  };
  Object.keys(componentsMap).forEach((componentName) => {
    let component = componentsMap[componentName];
    if (component && (component as ComponentSchema).componentName === 'Component') {
      components[componentName] = createComponent(component as ComponentSchema);
    } else if (isReactComponent(component)) {
      components[componentName] = component;
    } else {
      component = findComponent(libraryMap, componentName, component as NpmInfo);
      if (component) {
        components[componentName] = component;
      }
    }
  });
  return components;
}

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

function getClosestNodeInstance(from: any, specId?: string): NodeInstance<any> | null {
  const el: any = from;
  if (el) {
    // if (isElement(el)) {
    //   el = cacheReactKey(el);
    // } else {
    //   return getNodeInstance(el, specId);
    // }
    return getNodeInstance(el);
  }
  return null;
}

function getNodeInstance(dom: HTMLElement): NodeInstance<any> | null {
  const INTERNAL = '_internal';

  let instance = Instance.get(dom);
  while (instance && instance[INTERNAL]) {
    if (isValidDesignModeRaxComponentInstance(instance)) {
      const docId = (instance as any)[SYMBOL_VDID];
      return {
        docId,
        nodeId: instance.props._leaf.getId(),
        instance: instance,
        node: instance.props._leaf,
      };
    }

    instance = instance[INTERNAL].__parentInstance;
  }

  return null;
}


function checkInstanceMounted(instance: any): boolean {
  if (isElement(instance)) {
    return instance.parentElement != null;
  }
  return true;
}


function isValidDesignModeRaxComponentInstance(
  raxComponentInst: any,
): raxComponentInst is {
  props: {
    _leaf: Exclude<NodeInstance<any>['node'], null | undefined>;
  };
} {
  const leaf = raxComponentInst?.props?._leaf;
  return leaf && typeof leaf === 'object' && leaf.isNode;
}

export class DocumentInstance {
  private instancesMap = new Map<string, any[]>();

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

  @computed get suspended(): any {
    return false;
  }
  @computed get scope(): any {
    return null;
  }

  get path(): string {
    return '/' + this.document.fileName;
  }

  get id() {
    return this.document.id;
  }

  private unmountIntance(id: string, instance: any) {
    const instances = this.instancesMap.get(id);
    if (instances) {
      const i = instances.indexOf(instance);
      if (i > -1) {
        instances.splice(i, 1);
        host.setInstance(this.document.id, id, instances);
      }
    }
  }

  mountInstance(id: string, instance: any) {
    const docId = this.document.id;
    const instancesMap = this.instancesMap;
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
      const newUnmount = function(this: any) {
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
    return null;
    // return this.document.getNode(id);
  }
}

export class SimulatorRendererContainer implements BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer = true;
  private dispose?: () => void;
  // TODO: history
  readonly history: any;

  @obx.ref private _documentInstances: DocumentInstance[] = [];
  get documentInstances() {
    return this._documentInstances;
  }

  constructor() {
    this.dispose = host.connect(this, () => {
      // sync layout config
      // todo: split with others, not all should recompute
      if (this._libraryMap !== host.libraryMap || this._componentsMap !== host.designer.componentsMap) {
        this._libraryMap = host.libraryMap || {};
        this._componentsMap = host.designer.componentsMap;
        this.buildComponents();
      }

      // sync designMode
      this._designMode = host.designMode;

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
      } else {
        if (this.history.location.pathname !== path) {
          this.history.replace(path);
        }
      }
    });
    /*
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
            const search = history.location.search;
            return parseQuery(search);
          }
        }
      },
      constants: {},
    };
    host.injectionConsumer.consume((data) => {
      // sync utils, i18n, contants,... config
    });
    */
  }

  @computed get layout(): any {
    // TODO: parse layout Component
    return null;
  }

  private _libraryMap: { [key: string]: string } = {};
  private buildComponents() {
    // TODO: remove this.createComponent
    this._components = buildComponents(this._libraryMap, this._componentsMap, this.createComponent.bind(this));
  }
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
  @obx.ref private _designMode: string = 'design';
  @computed get designMode(): any {
    return this._designMode;
  }
  @obx.ref private _device: string = 'default';
  @computed get device() {
    return this._device;
  }
  @obx.ref private _componentsMap = {};
  @computed get componentsMap(): any {
    return this._componentsMap;
  }
  /**
   * 加载资源
   */
  load(asset: Asset): Promise<any> {
    return loader.load(asset);
  }

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

    return null;
  }

  getClosestNodeInstance(from: any, nodeId?: string): NodeInstance<any> | null {
    const el: any = from;
    if (el) {
      // if (isElement(el)) {
      //   el = cacheReactKey(el);
      // } else {
      //   return getNodeInstance(el, specId);
      // }
      return getNodeInstance(el);
    }
    return null;
  }

  getComponentInstances(id: string): any[] | null {
    return this.instancesMap.get(id) || null;
  }

  onReRender(fn: () => void) {
    this.emitter.on('rerender', fn);
    return () => {
      this.emitter.removeListener('renderer', fn);
    };
  }

  findDOMNodes(instance: any): Array<Element | Text> | null {
    return raxFindDOMNodes(instance);
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

  createComponent(schema: ComponentSchema): Component | null {
    return null;
    // TODO: use ComponentEngine refactor
    /*
    const _schema = {
      ...schema,
    };
    _schema.methods = {};
    _schema.lifeCycles = {};

    const node = host.document.createNode(_schema);
    _schema = node.export(TransformStage.Render);

    const processPropsSchema = (propsSchema: any, propsMap: any): any => {
      if (!propsSchema) {
        return {};
      }

      const result = { ...propsSchema };
      const reg = /^(?:this\.props|props)\.(\S+)$/;
      Object.keys(result).map((key: string) => {
        if (result[key]?.type === 'JSExpression') {
          const { value } = result[key];
          const matched = reg.exec(value);
          if (matched) {
            const propName = matched[1];
            result[key] = propsMap[propName];
          }
        } else if (result[key]?.type === 'JSSlot') {
          const schema = result[key].value;
          result[key] = createElement(Ele, {schema, propsMap: {}});
        }
      });

      return result;
    };

    const renderer = this;
    const componentsMap = renderer.componentsMap;

    class Ele extends React.Component<{ schema: any, propsMap: any }> {
      private isModal: boolean;

      constructor(props: any){
        super(props);
        const componentMeta = host.document.getComponentMeta(props.schema.componentName);
        if (componentMeta?.prototype?.isModal()) {
          this.isModal = true;
          return;
        }
      }

      render() {
        if (this.isModal) {
          return null;
        }
        const { schema, propsMap } = this.props;
        const Com = componentsMap[schema.componentName];
        if (!Com) {
          return null;
        }
        let children = null;
        if (schema.children && schema.children.length > 0) {
          children = schema.children.map((item: any) => createElement(Ele, {schema: item, propsMap}));
        }
        const props = processPropsSchema(schema.props, propsMap);
        const _leaf = host.document.createNode(schema);

        return createElement(Com, {...props, _leaf}, children);
      }
      const _leaf = this.document.designer.currentDocument?.createNode(schema);
      const node = this.document.createNode(schema);
      let props = processPropsSchema(schema.props, propsMap);
      props = this.document.designer.transformProps(props, node, TransformStage.Init);
      props = this.document.designer.transformProps(props, node, TransformStage.Render);
      return createElement(Com, { ...props, _leaf }, children);
    };

    const container = this;
    class Com extends React.Component {
      render() {
        const componentsMap = container.componentsMap;
        let children = null;
        if (_schema.children && Array.isArray(_schema.children)) {
          children = _schema.children?.map((item: any) => getElement(componentsMap, item, this.props));
        }
      }
    }

    return Com;
    */
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

    raxRender(createElement(SimulatorRendererView, { renderer: this }), container, {
      driver: DriverUniversal,
    });
    host.project.setRendererReady(this);
  }
}

function getSubComponent(library: any, paths: string[]) {
  const l = paths.length;
  if (l < 1 || !library) {
    return library;
  }
  let i = 0;
  let component: any;
  while (i < l) {
    const key = paths[i]!;
    let ex: any;
    try {
      component = library[key];
    } catch (e) {
      ex = e;
      component = null;
    }
    if (i === 0 && component == null && key === 'default') {
      if (ex) {
        return l === 1 ? library : null;
      }
      component = library;
    } else if (component == null) {
      return null;
    }
    library = component;
    i++;
  }
  return component;
}

function findComponent(libraryMap: LibraryMap, componentName: string, npm?: NpmInfo) {
  if (!npm) {
    return accessLibrary(componentName);
  }
  // libraryName the key access to global
  // export { exportName } from xxx exportName === global.libraryName.exportName
  // export exportName from xxx   exportName === global.libraryName.default || global.libraryName
  // export { exportName as componentName } from package
  // if exportName == null exportName === componentName;
  // const componentName = exportName.subName, if exportName empty subName donot use
  const exportName = npm.exportName || npm.componentName || componentName;
  const libraryName = libraryMap[npm.package] || exportName;
  const library = accessLibrary(libraryName);
  const paths = npm.exportName && npm.subName ? npm.subName.split('.') : [];
  if (npm.destructuring) {
    paths.unshift(exportName);
  } else if (isESModule(library)) {
    paths.unshift('default');
  }
  return getSubComponent(library, paths);
}

export default new SimulatorRendererContainer();
