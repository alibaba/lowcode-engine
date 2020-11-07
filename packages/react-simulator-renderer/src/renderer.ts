import React, { createElement, ReactInstance } from 'react';
import { render as reactRender } from 'react-dom';
import { host } from './host';
import SimulatorRendererView from './renderer-view';
import { computed, obx } from '@recore/obx';
import { Asset,
  isElement,
  cursor,
  setNativeSelection,
  buildComponents,
  getSubComponent,
  AssetLoader,
} from '@ali/lowcode-utils';
import { getClientRects } from './utils/get-client-rects';
import { reactFindDOMNodes, FIBER_KEY } from './utils/react-find-dom-nodes';

import { RootSchema, ComponentSchema, TransformStage, NodeSchema } from '@ali/lowcode-types';
// import { isESModule, isElement, acceptsRef, wrapReactClass, cursor, setNativeSelection } from '@ali/lowcode-utils';
// import { RootSchema, NpmInfo, ComponentSchema, TransformStage, NodeSchema } from '@ali/lowcode-types';
// just use types
import { BuiltinSimulatorRenderer, NodeInstance, Component } from '@ali/lowcode-designer';
import Slot from './builtin-components/slot';
import Leaf from './builtin-components/leaf';

const loader = new AssetLoader();

export class SimulatorRenderer implements BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer = true;

  private dispose?: () => void;

  constructor() {
    if (!host) {
      return;
    }

    this.dispose = host.connect(this, () => {
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

      this._requestHandlersMap = host.requestHandlersMap;

      // sync suspended

      // sync scope

      // sync device
      this._device = host.device;
    });

    host.componentsConsumer.consume(async (componentsAsset) => {
      if (componentsAsset) {
        await this.load(componentsAsset);
        this.buildComponents();
      }
    });
    host.injectionConsumer.consume(() => {
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

  private _libraryMap: { [key: string]: string } = {};

  private buildComponents() {
    this._components = {
      ...builtinComponents,
      ...buildComponents(this._libraryMap, this._componentsMap),
    };
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

  /**
   * 加载资源
   */
  load(asset: Asset): Promise<any> {
    return loader.load(asset);
  }

  async loadAsyncLibrary(asyncLibraryMap) {
    await loader.loadAsyncLibrary(asyncLibraryMap);
    this.buildComponents();
  }

  private instancesMap = new Map<string, ReactInstance[]>();

  private unmountIntance(id: string, instance: ReactInstance) {
    const instances = this.instancesMap.get(id);
    if (instances) {
      const i = instances.indexOf(instance);
      if (i > -1) {
        instances.splice(i, 1);
        host.setInstance(id, instances);
      }
    }
  }

  mountInstance(id: string, instance: ReactInstance | null) {
    const { instancesMap } = this;
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

  private ctxMap = new Map<string, object>();

  mountContext(id: string, ctx: object) {
    this.ctxMap.set(id, ctx);
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
  }

  getComponentInstances(id: string): ReactInstance[] | null {
    return this.instancesMap.get(id) || null;
  }

  createComponent(schema: NodeSchema): Component | null {
    let _schema: any = {
      ...schema,
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
          result[key] = createElement(Ele, { schema, propsMap: {} });
        }
      });

      return result;
    };

    const renderer = this;
    const { componentsMap } = renderer;

    class Ele extends React.Component<{ schema: any; propsMap: any }> {
      private isModal: boolean;

      constructor(props: any) {
        super(props);
        const componentMeta = host.document.getComponentMeta(props.schema.componentName);
        if (componentMeta?.prototype?.isModal()) {
          this.isModal = true;
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
          children = schema.children.map((item: any) => createElement(Ele, { schema: item, propsMap }));
        }
        const props = processPropsSchema(schema.props, propsMap);
        const _leaf = host.document.createNode(schema);

        return createElement(Com, { ...props, _leaf }, children);
      }
    }

    class Com extends React.Component {
      // TODO: 暂时解决性能问题
      shouldComponentUpdate() {
        return false;
      }

      render() {
        const { componentName } = _schema;
        if (componentName === 'Component') {
          let children = [];
          const propsMap = this.props || {};
          if (_schema.children && Array.isArray(_schema.children)) {
            children = _schema.children.map((item: any) => createElement(Ele, { schema: item, propsMap }));
          }
          return createElement('div', {}, children);
        } else {
          return createElement(Ele, { schema: _schema, propsMap: {} });
        }
      }
    }

    return Com;
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

    reactRender(createElement(SimulatorRendererView, { renderer: this }), container);
    host.document.setRendererReady(this);
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
      if (!specId || specId === nodeId) {
        return {
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
    if (!specId || specId === nodeId) {
      return {
        nodeId,
        instance,
      };
    }
  }
  return getNodeInstance(fiberNode?.return);
}

function checkInstanceMounted(instance: any): boolean {
  if (isElement(instance)) {
    return instance.parentElement != null;
  }
  return true;
}

export default new SimulatorRenderer();
