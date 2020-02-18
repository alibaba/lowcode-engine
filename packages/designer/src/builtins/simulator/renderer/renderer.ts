import { createElement, ReactInstance } from 'react';
import { render as reactRender } from 'react-dom';
import { host } from './host';
import SimulatorRendererView from './renderer-view';
import { computed, obx } from '@recore/obx';
import { RootSchema, NpmInfo } from '../../../designer/schema';
import { isElement, getClientRects } from '../../../utils/dom';
import { Asset } from '../utils/asset';
import loader from '../utils/loader';
import { ComponentDescriptionSpec } from '../../../designer/component-config';
import { findDOMNodes } from '../utils/react';
import { isESModule } from '../../../utils/is-es-module';
import { NodeInstance } from '../../../designer/simulator';

let REACT_KEY = '';
function cacheReactKey(el: Element): Element {
  if (REACT_KEY !== '') {
    return el;
  }
  REACT_KEY = Object.keys(el).find(key => key.startsWith('__reactInternalInstance$')) || '';
  if (!REACT_KEY && (el as HTMLElement).parentElement) {
    return cacheReactKey((el as HTMLElement).parentElement!);
  }
  return el;
}

const SYMBOL_VNID = Symbol('_LCNodeId');

function getClosestNodeInstance(element: Element): NodeInstance | null {
  let el: any = element;
  if (el) {
    el = cacheReactKey(el);
  }
  while (el) {
    if (SYMBOL_VNID in el) {
      return {
        nodeId: el[SYMBOL_VNID],
        instance: el,
      };
    }
    // get fiberNode from element
    if (el[REACT_KEY]) {
      return getNodeInstance(el[REACT_KEY]);
    }
    el = el.parentElement;
  }
  return null;
}

function getNodeInstance(fiberNode: any): NodeInstance | null {
  const instance = fiberNode.stateNode;
  if (instance && SYMBOL_VNID in instance) {
    return {
      nodeId: instance[SYMBOL_VNID],
      instance,
    };
  }
  return getNodeInstance(fiberNode.return);
}

function checkInstanceMounted(instance: any): boolean {
  if (isElement(instance)) {
    return instance.parentElement != null;
  }
  return true;
}

export class SimulatorRenderer {
  readonly isSimulatorRenderer = true;
  private dispose?: () => void;
  constructor() {
    if (!host) {
      return;
    }
    this.dispose = host.connect(this, () => {
      // sync layout config

      // sync schema
      this._schema = host.document.schema;

      this._componentsMap = host.designer.componentsMap;
      this.buildComponents();

      // sync designMode

      // sync suspended

      // sync scope

      // sync device
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

  @computed get layout(): any {
    // TODO: parse layout Component
    return null;
  }

  @obx.ref private _schema?: RootSchema;
  @computed get schema(): any {
    return this._schema;
  }
  private buildComponents() {
    this._components = buildComponents(this._componentsMap);
  }
  @obx.ref private _components = {};
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

  @computed get designMode(): any {
    return 'border';
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
  /**
   * 加载资源
   */
  load(asset: Asset): Promise<any> {
    return loader.load(asset);
  }
  private instancesMap = new Map<string, ReactInstance[]>();
  mountInstance(id: string, instance: ReactInstance | null) {
    const instancesMap = this.instancesMap;
    if (instance == null) {
      let instances = this.instancesMap.get(id);
      if (instances) {
        instances = instances.filter(checkInstanceMounted);
        if (instances.length > 0) {
          instancesMap.set(id, instances);
        } else {
          instancesMap.delete(id);
        }
      }
      return;
    }
    if (isElement(instance)) {
      cacheReactKey(instance);
    } else if (!(instance as any)[SYMBOL_VNID]) {
      const origUnmout = instance.componentWillUnmount;
      // hack! delete instance from map
      instance.componentWillUnmount = function() {
        const instances = instancesMap.get(id);
        if (instances) {
          const i = instances.indexOf(instance);
          if (i > -1) {
            instances.splice(i, 1);
          }
        }
        origUnmout && origUnmout.call(this);
      };
    }

    (instance as any)[SYMBOL_VNID] = id;
    let instances = this.instancesMap.get(id);
    if (instances) {
      instances = instances.filter(checkInstanceMounted);
      instances.push(instance);
      instancesMap.set(id, instances);
    } else {
      instancesMap.set(id, [instance]);
    }
  }
  private ctxMap = new Map<string, object>();
  mountContext(id: string, ctx: object) {
    this.ctxMap.set(id, ctx);
  }

  getComponentInstance(id: string): ReactInstance[] | null {
    return this.instancesMap.get(id) || null;
  }

  getClosestNodeInstance(element: Element): NodeInstance | null {
    return getClosestNodeInstance(element);
  }

  findDOMNodes(instance: ReactInstance): Array<Element | Text> | null {
    return findDOMNodes(instance);
  }

  getClientRects(element: Element | Text) {
    return getClientRects(element);
  }

  private _running: boolean = false;
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

    reactRender(createElement(SimulatorRendererView, { renderer: this }), container);
  }
}

function accessLibrary(library: string | object) {
  if (typeof library !== 'string') {
    return library;
  }

  return (window as any)[library];
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

function findComponent(componentName: string, npm?: NpmInfo) {
  if (!npm) {
    return accessLibrary(componentName);
  }
  // libraryName the key access to global
  // export { exportName } from xxx exportName === global.libraryName.exportName
  // export exportName from xxx   exportName === global.libraryName.default || global.libraryName
  // export { exportName as componentName } from package
  // if exportName == null exportName === componentName;
  // const componentName = exportName.subName, if exportName empty subName donot use
  const libraryName = npm.exportName || npm.componentName || componentName;
  const library = accessLibrary(libraryName);
  const paths = npm.exportName && npm.subName ? npm.subName.split('.') : [];
  if (npm.destructuring) {
    paths.unshift(libraryName);
  } else if (isESModule(library)) {
    paths.unshift('default');
  }
  return getSubComponent(library, paths);
}

function buildComponents(componentsMap: { [componentName: string]: ComponentDescriptionSpec }) {
  const components: any = {};
  Object.keys(componentsMap).forEach(componentName => {
    components[componentName] = findComponent(componentName, componentsMap[componentName].npm);
  });
  return components;
}

export default new SimulatorRenderer();
