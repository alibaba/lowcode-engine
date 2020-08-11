import { BuiltinSimulatorRenderer, NodeInstance, Component } from '@ali/lowcode-designer';
import { shared, render as raxRender, createElement } from 'rax';
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

function accessLibrary(library: string | object) {
  if (typeof library !== 'string') {
    return library;
  }

  return (window as any)[library];
}

export class SimulatorRenderer implements BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer = true;
  private dispose?: () => void;

  private instancesMap = new Map<string, any[]>();
  @obx.ref private _schema?: RootSchema;
  @computed get schema(): any {
    return this._schema;
  }
  private _libraryMap: { [key: string]: string } = {};
  private buildComponents() {
    this._components = buildComponents(this._libraryMap, this._componentsMap);
  }
  @obx.ref private _components: any = {};
  @computed get components(): object {
    // 根据 device 选择不同组件，进行响应式
    // 更好的做法是，根据 device 选择加载不同的组件资源，甚至是 simulatorUrl
    return this._components;
  }

  @obx.ref private _designMode = 'design';
  @computed get designMode(): any {
    return this._designMode;
  }

  @obx.ref private _componentsMap = {};
  @computed get componentsMap(): any {
    return this._componentsMap;
  }

  @obx.ref private _device = 'default';
  @computed get device() {
    return this._device;
  }

  // context from: utils、constants、history、location、match
  @obx.ref private _appContext = {};
  @computed get context(): any {
    return this._appContext;
  }

  @computed get suspended(): any {
    return false;
  }
  @computed get scope(): any {
    return null;
  }

  @computed get layout(): any {
    // TODO: parse layout Component
    return null;
  }
  private emitter = new EventEmitter();

  constructor() {
    if (!host) {
      return;
    }

    this.dispose = host.connect(this as any, () => {
      // sync layout config

      // sync schema
      this._schema = host.document.export(1);

      // todo: split with others, not all should recompute
      if (this._libraryMap !== host.libraryMap || this._componentsMap !== host.designer.componentsMap) {
        this._libraryMap = host.libraryMap || {};
        this._componentsMap = host.designer.componentsMap;
        this.buildComponents();
      }

      // sync designMode
      this._designMode = host.designMode;

      // sync suspended

      // sync scope

      // sync device
      this._device = host.device;

      this.emitter.emit('rerender');
    });
    host.componentsConsumer.consume(async (componentsAsset) => {
      if (componentsAsset) {
        await this.load(componentsAsset);
        this.buildComponents();
      }
    });
    host.injectionConsumer.consume((data) => {
      // sync utils, i18n, contants,... config
      this._appContext = {
        utils: {},
        constants: {
          name: 'demo',
        },
      };
    });
  }

  getClosestNodeInstance(from: any, nodeId?: string): NodeInstance<any> | null {
    const node = getClosestNodeInstance(from, nodeId);
    return node;
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

    // return null;
  }

  createComponent(schema: ComponentSchema): Component | null {
    return null;
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

  findDOMNodes(instance: any): Array<Element | Text> | null {
    return [raxFindDOMNodes(instance)];
  }

  /**
   * 加载资源
   */
  load(asset: Asset): Promise<any> {
    return loader.load(asset);
  }

  // private instancesMap = new Map<string, any[]>();
  private unmountIntance(id: string, instance: any) {
    const instances = this.instancesMap.get(id);
    if (instances) {
      const i = instances.indexOf(instance);
      if (i > -1) {
        instances.splice(i, 1);
        host.setInstance(id, instances);
      }
    }
  }
  mountInstance(id: string, instance: any | null) {
    const instancesMap = this.instancesMap;
    if (instance == null) {
      let instances = this.instancesMap.get(id);
      if (instances) {
        instances = instances.filter(checkInstanceMounted);
        if (instances.length > 0) {
          instancesMap.set(id, instances);
          host.setInstance(id, instances);
        } else {
          instancesMap.delete(id);
          host.setInstance(id, null);
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
      // cacheReactKey(instance);
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
    host.setInstance(id, instances);
  }

  getClientRects(element: Element | Text) {
    return getClientRects(element);
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
    host.document.setRendererReady(this);
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

const builtinComponents = {
  Slot,
  Leaf,
};

function buildComponents(libraryMap: LibraryMap, componentsMap: { [componentName: string]: NpmInfo }) {
  const components: any = {
    ...builtinComponents,
  };
  Object.keys(componentsMap).forEach((componentName) => {
    let component = componentsMap[componentName];
    if (isReactComponent(component)) {
      components[componentName] = component;
    } else {
      component = findComponent(libraryMap, componentName, component);
      if (component) {
        components[componentName] = component;
      }
    }
  });
  return components;
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

function getNodeInstance(dom: HTMLElement): NodeInstance<any> | null {
  const INTERNAL = '_internal';

  let instance = Instance.get(dom);
  while (instance && instance[INTERNAL]) {
    if (isValidDesignModeRaxComponentInstance(instance)) {
      return {
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

export default new SimulatorRenderer();
