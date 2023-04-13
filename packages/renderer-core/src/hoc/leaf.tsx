import { INode, IPublicTypePropChangeOptions } from '@alilc/lowcode-designer';
import { GlobalEvent, IPublicEnumTransformStage, IPublicTypeNodeSchema, IPublicTypeEngineOptions } from '@alilc/lowcode-types';
import { isReactComponent, cloneEnumerableProperty } from '@alilc/lowcode-utils';
import { debounce } from '../utils/common';
import adapter from '../adapter';
import * as types from '../types/index';

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
  forwardedRef?: any;
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

type DesignMode = Pick<IPublicTypeEngineOptions, 'designMode'>['designMode'];

export interface IComponentHoc {
  designMode: DesignMode | DesignMode[];
  hoc: IComponentConstruct;
}

export type IComponentConstruct = (Comp: types.IBaseRenderComponent, info: IComponentHocInfo) => types.IGeneralConstructor;

interface IProps {
  _leaf: INode | undefined;

  visible: boolean;

  componentId: number;

  children?: INode[];

  __tag: number;

  forwardedRef?: any;
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

  constructor(public documentId: string, public device: string) {
  }
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
  const debounceRerender = debounce(() => {
    container.rerender();
  }, 20);
  cache.event.set(schema.id, {
    clear: false,
    leaf,
    dispose: [
      leaf?.onPropChange?.(() => {
        if (!container.autoRepaintNode) {
          return;
        }
        __debug(`${schema.componentName}[${schema.id}] leaf not render in SimulatorRendererView, leaf onPropsChange make rerender`);
        debounceRerender();
      }),
      leaf?.onChildrenChange?.(() => {
        if (!container.autoRepaintNode) {
          return;
        }
        __debug(`${schema.componentName}[${schema.id}] leaf not render in SimulatorRendererView, leaf onChildrenChange make rerender`);
        debounceRerender();
      }) as Function,
      leaf?.onVisibleChange?.(() => {
        if (!container.autoRepaintNode) {
          return;
        }
        __debug(`${schema.componentName}[${schema.id}] leaf not render in SimulatorRendererView, leaf onVisibleChange make rerender`);
        debounceRerender();
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
    __parseData,
  } = baseRenderer;
  const { engine } = baseRenderer.context;
  const host = baseRenderer.props?.__host;
  const curDocumentId = baseRenderer.props?.documentId ?? '';
  const curDevice = baseRenderer.props?.device ?? '';
  const getNode = baseRenderer.props?.getNode;
  const container = baseRenderer.props?.__container;
  const setSchemaChangedSymbol = baseRenderer.props?.setSchemaChangedSymbol;
  const editor = host?.designer?.editor;
  const runtime = adapter.getRuntime();
  const { forwardRef, createElement } = runtime;
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
      node?: INode;
    } = {};

    private curEventLeaf: INode | undefined;

    static displayName = schema.componentName;

    disposeFunctions: Array<((() => void) | Function)> = [];

    __component_tag = 'leafWrapper';

    renderUnitInfo: {
      minimalUnitId?: string;
      minimalUnitName?: string;
      singleRender?: boolean;
    };

    // 最小渲染单元做防抖处理
    makeUnitRenderDebounced = debounce(() => {
      this.beforeRender(RerenderType.MinimalRenderUnit);
      const schema = this.leaf?.export?.(IPublicEnumTransformStage.Render);
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

    constructor(props: IProps, context: any) {
      super(props, context);
      // 监听以下事件，当变化时更新自己
      __debug(`${schema.componentName}[${this.props.componentId}] leaf render in SimulatorRendererView`);
      clearRerenderEvent(componentCacheId);
      this.curEventLeaf = this.leaf;

      cache.ref.set(componentCacheId, {
        makeUnitRender: this.makeUnitRender,
      });

      let cacheState = cache.state.get(componentCacheId);
      if (!cacheState || cacheState.__tag !== props.__tag) {
        cacheState = this.getDefaultState(props);
      }

      this.state = cacheState;
    }

    recordTime = () => {
      if (!this.recordInfo.startTime) {
        return;
      }
      const endTime = Date.now();
      const nodeCount = host?.designer?.currentDocument?.getNodeCount?.();
      const componentName = this.recordInfo.node?.componentName || this.leaf?.componentName || 'UnknownComponent';
      editor?.eventBus.emit(GlobalEvent.Node.Rerender, {
        componentName,
        time: endTime - this.recordInfo.startTime,
        type: this.recordInfo.type,
        nodeCount,
      });
      this.recordInfo.startTime = null;
    };

    makeUnitRender = () => {
      this.makeUnitRenderDebounced();
    };

    get autoRepaintNode() {
      return container?.autoRepaintNode;
    }

    componentDidUpdate() {
      this.recordTime();
    }

    componentDidMount() {
      const _leaf = this.leaf;
      this.initOnPropsChangeEvent(_leaf);
      this.initOnChildrenChangeEvent(_leaf);
      this.initOnVisibleChangeEvent(_leaf);
      this.recordTime();
    }

    getDefaultState(nextProps: any) {
      const {
        hidden = false,
        condition = true,
      } = nextProps.__inner__ || this.leaf?.export?.(IPublicEnumTransformStage.Render) || {};
      return {
        nodeChildren: null,
        childrenInState: false,
        visible: !hidden,
        condition: __parseData?.(condition, scope),
        nodeCacheProps: {},
        nodeProps: {},
      };
    }

    setState(state: any) {
      cache.state.set(componentCacheId, {
        ...this.state,
        ...state,
        __tag: this.props.__tag,
      });
      super.setState(state);
    }

    /** 由于内部属性变化，在触发渲染前，会执行该函数 */
    beforeRender(type: string, node?: INode): void {
      this.recordInfo.startTime = Date.now();
      this.recordInfo.type = type;
      this.recordInfo.node = node;
      setSchemaChangedSymbol?.(true);
    }

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
        container?.rerender();
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

      if (leaf.isRootNode) {
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

    componentWillReceiveProps(nextProps: any) {
      let { componentId } = nextProps;
      if (nextProps.__tag === this.props.__tag) {
        return null;
      }

      const _leaf = getNode?.(componentId);
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
      } = this.getDefaultState(nextProps);
      this.setState(resetState);
    }

    /** 监听参数变化 */
    initOnPropsChangeEvent(leaf = this.leaf): void {
      const handlePropsChange = debounce((propChangeInfo: IPublicTypePropChangeOptions) => {
        const {
          key,
          newValue = null,
        } = propChangeInfo;
        const node = leaf;

        if (key === '___condition___') {
          const { condition = true } = this.leaf?.export(IPublicEnumTransformStage.Render) || {};
          const conditionValue = __parseData?.(condition, scope);
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
          container?.rerender();
          // 由于 scope 变化，需要清空缓存，使用新的 scope
          cache.component.delete(componentCacheId);
          return;
        }
        this.beforeRender(RerenderType.PropsChanged);
        const { state } = this;
        const { nodeCacheProps } = state;
        const nodeProps = getProps(node?.export?.(IPublicEnumTransformStage.Render) as IPublicTypeNodeSchema, scope, Comp, componentInfo);
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
      const dispose = leaf?.onPropChange?.((propChangeInfo: IPublicTypePropChangeOptions) => {
        if (!this.autoRepaintNode) {
          return;
        }
        handlePropsChange(propChangeInfo);
      });

      dispose && this.disposeFunctions.push(dispose);
    }

    /**
     * 监听显隐变化
     */
    initOnVisibleChangeEvent(leaf = this.leaf) {
      const dispose = leaf?.onVisibleChange?.((flag: boolean) => {
        if (!this.autoRepaintNode) {
          return;
        }
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
        if (!this.autoRepaintNode) {
          return;
        }
        const {
          type,
          node,
        } = param || {};
        this.beforeRender(`${RerenderType.ChildChanged}-${type}`, node);
        // TODO: 缓存同级其他元素的 children。
        // 缓存二级 children Next 查询筛选组件有问题
        // 缓存一级 children Next Tab 组件有问题
        const nextChild = getChildren(leaf?.export?.(IPublicEnumTransformStage.Render) as types.ISchema, scope, Comp);
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

    get leaf(): INode | undefined {
      if (this.props._leaf?.isMock) {
        // 低代码组件作为一个整体更新，其内部的组件不需要监听相关事件
        return undefined;
      }

      return getNode?.(componentCacheId);
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

      delete compProps.__inner__;

      return engine.createElement(Comp, compProps, this.hasChildren ? this.children : null);
    }
  }

  let LeafWrapper = forwardRef((props: any, ref: any) => {
    return createElement(LeafHoc, {
      ...props,
      forwardedRef: ref,
    });
  });

  LeafWrapper = cloneEnumerableProperty(LeafWrapper, Comp);

  LeafWrapper.displayName = (Comp as any).displayName;

  cache.component.set(componentCacheId, LeafWrapper);

  return LeafWrapper;
}