import { BuiltinSimulatorHost, Node, PropChangeOptions } from '@alilc/lowcode-designer';
import { GlobalEvent, TransformStage, NodeSchema } from '@alilc/lowcode-types';
import { isReactComponent, cloneEnumerableProperty } from '@alilc/lowcode-utils';
import { EngineOptions } from '@alilc/lowcode-editor-core';
import { debounce } from '../utils/common';
import adapter from '../adapter';
import * as types from '../types/index';
import { parseData } from '../utils';

export interface IComponentHocInfo {
  schema: any;
  baseRenderer: types.IBaseRendererInstance;
  componentInfo: any;
  scope: any;
}

export interface IComponentHocProps {
  __tag: any;
  componentId: any;
  _leaf: any;
  forwardedRef: any;
}

export interface IComponentHocState {
  childrenInState: boolean;
  nodeChildren: any;
  nodeCacheProps: any;
  /** 控制是否显示隐藏 */
  visible: boolean;
  /** 控制是否渲染 */
  condition: boolean;
  nodeProps: any;
}

type DesignMode = Pick<EngineOptions, 'designMode'>['designMode'];

export interface IComponentHoc {
  designMode: DesignMode | DesignMode[];
  hoc: IComponentConstruct;
}

export type IComponentConstruct = (Comp: types.IBaseRenderComponent, info: IComponentHocInfo) => types.IGeneralConstructor;

interface IProps {
  _leaf: Node | undefined;

  visible: boolean;

  componentId?: number;

  children?: Node[];

  __tag?: number;
}

enum RerenderType {
  All = 'All',
  ChildChanged = 'ChildChanged',
  PropsChanged = 'PropsChanged',
  VisibleChanged = 'VisibleChanged',
  MinimalRenderUnit = 'MinimalRenderUnit',
}

// 缓存 Leaf 层组件，防止重新渲染问题
class LeafCache {
  constructor(public documentId: string, public device: string) {
  }
  /** 组件缓存 */
  component = new Map();

  /**
   * 状态缓存，场景：属性变化后，改组件被销毁，state 为空，没有展示修改后的属性
   */
  state = new Map();

  /**
   * 订阅事件缓存，导致 rerender 的订阅事件
   */
  event = new Map();

  ref = new Map();
}

let cache: LeafCache;

/** 部分没有渲染的 node 节点进行兜底处理 or 渲染方式没有渲染 LeafWrapper */
function initRerenderEvent({
  schema,
  __debug,
  container,
  getNode,
}: any) {
  const leaf = getNode?.(schema.id);
  if (!leaf
    || cache.event.get(schema.id)?.clear
    || leaf === cache.event.get(schema.id)
  ) {
    return;
  }
  cache.event.get(schema.id)?.dispose.forEach((disposeFn: any) => disposeFn && disposeFn());
  cache.event.set(schema.id, {
    clear: false,
    leaf,
    dispose: [
      leaf?.onPropChange?.(() => {
        __debug(`${schema.componentName}[${schema.id}] leaf not render in SimulatorRendererView, leaf onPropsChange make rerender`);
        container.rerender();
      }),
      leaf?.onChildrenChange?.(() => {
        __debug(`${schema.componentName}[${schema.id}] leaf not render in SimulatorRendererView, leaf onChildrenChange make rerender`);
        container.rerender();
      }) as Function,
      leaf?.onVisibleChange?.(() => {
        __debug(`${schema.componentName}[${schema.id}] leaf not render in SimulatorRendererView, leaf onVisibleChange make rerender`);
        container.rerender();
      }),
    ],
  });
}

/** 渲染的 node 节点全局注册事件清除 */
function clearRerenderEvent(id: string): void {
  if (cache.event.get(id)?.clear) {
    return;
  }
  cache.event.get(id)?.dispose?.forEach((disposeFn: any) => disposeFn && disposeFn());
  cache.event.set(id, {
    clear: true,
    dispose: [],
  });
}

// 给每个组件包裹一个 HOC Leaf，支持组件内部属性变化，自响应渲染
export function leafWrapper(Comp: types.IBaseRenderComponent, {
  schema,
  baseRenderer,
  componentInfo,
  scope,
}: IComponentHocInfo) {
  const {
    __debug,
    __getComponentProps: getProps,
    __getSchemaChildrenVirtualDom: getChildren,
  } = baseRenderer;
  const { engine } = baseRenderer.context;
  const host = baseRenderer.props?.__host;
  const curDocumentId = baseRenderer.props?.documentId ?? '';
  const curDevice = baseRenderer.props?.device ?? '';
  const getNode = baseRenderer.props?.getNode;
  const container: BuiltinSimulatorHost = baseRenderer.props?.__container;
  const setSchemaChangedSymbol = baseRenderer.props?.setSchemaChangedSymbol;
  const editor = host?.designer?.editor;
  const runtime = adapter.getRuntime();
  const { forwardRef } = runtime;
  const Component = runtime.Component as types.IGeneralConstructor<
    IComponentHocProps, IComponentHocState
  >;

  const componentCacheId = schema.id;

  if (!cache || (curDocumentId && curDocumentId !== cache.documentId) || (curDevice && curDevice !== cache.device)) {
    cache?.event.forEach(event => {
      event.dispose?.forEach((disposeFn: any) => disposeFn && disposeFn());
    });
    cache = new LeafCache(curDocumentId, curDevice);
  }

  if (!isReactComponent(Comp)) {
    console.error(`${schema.componentName} component may be has errors: `, Comp);
  }

  initRerenderEvent({
    schema,
    __debug,
    container,
    getNode,
  });

  if (curDocumentId && cache.component.has(componentCacheId)) {
    return cache.component.get(componentCacheId);
  }

  class LeafHoc extends Component {
    recordInfo: {
      startTime?: number | null;
      type?: string;
      node?: Node;
    } = {};
    static displayName = schema.componentName;

    disposeFunctions: Array<((() => void) | Function)> = [];

    __component_tag = 'leafWrapper';

    recordTime = () => {
      if (!this.recordInfo.startTime) {
        return;
      }
      const endTime = Date.now();
      const nodeCount = host?.designer?.currentDocument?.getNodeCount?.();
      const componentName = this.recordInfo.node?.componentName || this.leaf?.componentName || 'UnknownComponent';
      editor?.emit(GlobalEvent.Node.Rerender, {
        componentName,
        time: endTime - this.recordInfo.startTime,
        type: this.recordInfo.type,
        nodeCount,
      });
      this.recordInfo.startTime = null;
    };

    componentDidUpdate() {
      this.recordTime();
    }

    componentDidMount() {
      this.recordTime();
    }

    get defaultState() {
      const {
        hidden = false,
        condition = true,
      } = this.leaf?.export?.(TransformStage.Render) || {};
      return {
        nodeChildren: null,
        childrenInState: false,
        visible: !hidden,
        condition: parseData(condition, scope),
        nodeCacheProps: {},
        nodeProps: {},
      };
    }

    constructor(props: IProps, context: any) {
      super(props, context);
      // 监听以下事件，当变化时更新自己
      __debug(`${schema.componentName}[${this.props.componentId}] leaf render in SimulatorRendererView`);
      clearRerenderEvent(componentCacheId);
      const _leaf = this.leaf;
      this.initOnPropsChangeEvent(_leaf);
      this.initOnChildrenChangeEvent(_leaf);
      this.initOnVisibleChangeEvent(_leaf);
      this.curEventLeaf = _leaf;

      cache.ref.set(componentCacheId, {
        makeUnitRender: this.makeUnitRender,
      });

      let cacheState = cache.state.get(componentCacheId);
      if (!cacheState || cacheState.__tag !== props.__tag) {
        cacheState = this.defaultState;
      }

      this.state = cacheState;
    }

    private curEventLeaf: Node | undefined;

    setState(state: any) {
      cache.state.set(componentCacheId, {
        ...this.state,
        ...state,
        __tag: this.props.__tag,
      });
      super.setState(state);
    }

    /** 由于内部属性变化，在触发渲染前，会执行该函数 */
    beforeRender(type: string, node?: Node): void {
      this.recordInfo.startTime = Date.now();
      this.recordInfo.type = type;
      this.recordInfo.node = node;
      setSchemaChangedSymbol?.(true);
    }

    renderUnitInfo: {
      minimalUnitId?: string;
      minimalUnitName?: string;
      singleRender?: boolean;
    };

    judgeMiniUnitRender() {
      if (!this.renderUnitInfo) {
        this.getRenderUnitInfo();
      }

      const renderUnitInfo = this.renderUnitInfo || {
        singleRender: true,
      };

      if (renderUnitInfo.singleRender) {
        return;
      }

      const ref = cache.ref.get(renderUnitInfo.minimalUnitId);

      if (!ref) {
        __debug('Cant find minimalRenderUnit ref! This make rerender!');
        container.rerender();
        return;
      }
      __debug(`${this.leaf?.componentName}(${this.props.componentId}) need render, make its minimalRenderUnit ${renderUnitInfo.minimalUnitName}(${renderUnitInfo.minimalUnitId})`);
      ref.makeUnitRender();
    }

    getRenderUnitInfo(leaf = this.leaf) {
      // leaf 在低代码组件中存在 mock 的情况，退出最小渲染单元判断
      if (!leaf || typeof leaf.isRoot !== 'function') {
        return;
      }

      if (leaf.isRoot()) {
        this.renderUnitInfo = {
          singleRender: true,
          ...(this.renderUnitInfo || {}),
        };
      }
      if (leaf.componentMeta.isMinimalRenderUnit) {
        this.renderUnitInfo = {
          minimalUnitId: leaf.id,
          minimalUnitName: leaf.componentName,
          singleRender: false,
        };
      }
      if (leaf.hasLoop()) {
        // 含有循环配置的元素，父元素是最小渲染单元
        this.renderUnitInfo = {
          minimalUnitId: leaf?.parent?.id,
          minimalUnitName: leaf?.parent?.componentName,
          singleRender: false,
        };
      }
      if (leaf.parent) {
        this.getRenderUnitInfo(leaf.parent);
      }
    }

    // 最小渲染单元做防抖处理
    makeUnitRenderDebounced = debounce(() => {
      this.beforeRender(RerenderType.MinimalRenderUnit);
      const schema = this.leaf?.export?.(TransformStage.Render);
      if (!schema) {
        return;
      }
      const nextProps = getProps(schema, scope, Comp, componentInfo);
      const children = getChildren(schema, scope, Comp);
      const nextState = {
        nodeProps: nextProps,
        nodeChildren: children,
        childrenInState: true,
      };
      if ('children' in nextProps) {
        nextState.nodeChildren = nextProps.children;
      }

      __debug(`${this.leaf?.componentName}(${this.props.componentId}) MinimalRenderUnit Render!`);
      this.setState(nextState);
    }, 20);

    makeUnitRender = () => {
      this.makeUnitRenderDebounced();
    };

    componentWillReceiveProps(nextProps: any) {
      let { _leaf, componentId } = nextProps;
      if (nextProps.__tag === this.props.__tag) {
        return null;
      }

      _leaf = _leaf || getNode(componentId);
      if (_leaf && this.curEventLeaf && _leaf !== this.curEventLeaf) {
        this.disposeFunctions.forEach((fn) => fn());
        this.disposeFunctions = [];
        this.initOnChildrenChangeEvent(_leaf);
        this.initOnPropsChangeEvent(_leaf);
        this.initOnVisibleChangeEvent(_leaf);
        this.curEventLeaf = _leaf;
      }

      const {
        visible,
        ...resetState
      } = this.defaultState;
      this.setState(resetState);
    }

    /** 监听参数变化 */
    initOnPropsChangeEvent(leaf = this.leaf): void {
      const dispose = leaf?.onPropChange?.((propChangeInfo: PropChangeOptions) => {
        const {
          key,
          newValue = null,
        } = propChangeInfo;
        const node = leaf;

        if (key === '___condition___') {
          const { condition = true } = this.leaf?.export(TransformStage.Render) || {};
          const conditionValue = parseData(condition, scope);
          __debug(`key is ___condition___, change condition value to [${condition}]`);
          // 条件表达式改变
          this.setState({
            condition: conditionValue,
          });
          return;
        }

        // 如果循坏条件变化，从根节点重新渲染
        // 目前多层循坏无法判断需要从哪一层开始渲染，故先粗暴解决
        if (key === '___loop___') {
          __debug('key is ___loop___, render a page!');
          container.rerender();
          // 由于 scope 变化，需要清空缓存，使用新的 scope
          cache.component.delete(componentCacheId);
          return;
        }
        this.beforeRender(RerenderType.PropsChanged);
        const { state } = this;
        const { nodeCacheProps } = state;
        const nodeProps = getProps(node?.export?.(TransformStage.Render) as NodeSchema, scope, Comp, componentInfo);
        if (key && !(key in nodeProps) && (key in this.props)) {
          // 当 key 在 this.props 中时，且不存在在计算值中，需要用 newValue 覆盖掉 this.props 的取值
          nodeCacheProps[key] = newValue;
        }
        __debug(`${leaf?.componentName}[${this.props.componentId}] component trigger onPropsChange!`, nodeProps, nodeCacheProps, key, newValue);
        this.setState('children' in nodeProps ? {
          nodeChildren: nodeProps.children,
          nodeProps,
          childrenInState: true,
          nodeCacheProps,
        } : {
          nodeProps,
          nodeCacheProps,
        });

        this.judgeMiniUnitRender();
      });

      dispose && this.disposeFunctions.push(dispose);
    }

    /**
     * 监听显隐变化
     */
    initOnVisibleChangeEvent(leaf = this.leaf) {
      const dispose = leaf?.onVisibleChange?.((flag: boolean) => {
        if (this.state.visible === flag) {
          return;
        }

        __debug(`${leaf?.componentName}[${this.props.componentId}] component trigger onVisibleChange(${flag}) event`);
        this.beforeRender(RerenderType.VisibleChanged);
        this.setState({
          visible: flag,
        });
        this.judgeMiniUnitRender();
      });

      dispose && this.disposeFunctions.push(dispose);
    }

    /**
     * 监听子元素变化（拖拽，删除...）
     */
    initOnChildrenChangeEvent(leaf = this.leaf) {
      const dispose = leaf?.onChildrenChange?.((param): void => {
        const {
          type,
          node,
        } = param || {};
        this.beforeRender(`${RerenderType.ChildChanged}-${type}`, node);
        // TODO: 缓存同级其他元素的 children。
        // 缓存二级 children Next 查询筛选组件有问题
        // 缓存一级 children Next Tab 组件有问题
        const nextChild = getChildren(leaf?.export?.(TransformStage.Render) as types.ISchema, scope, Comp);
        __debug(`${schema.componentName}[${this.props.componentId}] component trigger onChildrenChange event`, nextChild);
        this.setState({
          nodeChildren: nextChild,
          childrenInState: true,
        });
        this.judgeMiniUnitRender();
      });
      dispose && this.disposeFunctions.push(dispose);
    }

    componentWillUnmount() {
      this.disposeFunctions.forEach(fn => fn());
    }

    get hasChildren(): boolean {
      let { children } = this.props;
      if (this.state.childrenInState) {
        children = this.state.nodeChildren;
      }

      if (Array.isArray(children)) {
        return Boolean(children && children.length);
      }

      return Boolean(children);
    }

    get children(): any {
      if (this.state.childrenInState) {
        return this.state.nodeChildren;
      }
      if (this.props.children && !Array.isArray(this.props.children)) {
        return [this.props.children];
      }
      if (this.props.children && this.props.children.length) {
        return this.props.children;
      }
      return [];
    }

    get leaf(): Node | undefined {
      return this.props._leaf || getNode(componentCacheId);
    }

    render() {
      if (!this.state.visible || !this.state.condition) {
        return null;
      }

      const {
        forwardedRef,
        ...rest
      } = this.props;

      const compProps = {
        ...rest,
        ...(this.state.nodeCacheProps || {}),
        ...(this.state.nodeProps || {}),
        children: [],
        __id: this.props.componentId,
        ref: forwardedRef,
      };

      return engine.createElement(Comp, compProps, this.hasChildren ? this.children : null);
    }
  }

  let LeafWrapper = forwardRef((props: any, ref: any) => (
    // @ts-ignore
    <LeafHoc
      {...props}
      forwardedRef={ref}
    />
  ));

  LeafWrapper = cloneEnumerableProperty(LeafWrapper, Comp);

  LeafWrapper.displayName = (Comp as any).displayName;

  cache.component.set(componentCacheId, LeafWrapper);

  return LeafWrapper;
}