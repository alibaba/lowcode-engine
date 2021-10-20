import { BuiltinSimulatorHost, Node, PropChangeOptions } from '@ali/lowcode-designer';
import { GlobalEvent, TransformStage } from '@ali/lowcode-types';
import { isReactComponent } from '@ali/lowcode-utils';
import { EngineOptions } from '@ali/lowcode-editor-core';
import adapter from '../adapter';
import * as types from '../types/index';

const compDefaultPropertyNames = [
  '$$typeof',
  'render',
  'defaultProps',
  'props',
];

export interface IComponentHocInfo {
  schema: any;
  baseRenderer: types.IBaseRendererInstance;
  componentInfo: any;
}

type DesignMode = Pick<EngineOptions, 'designMode'>['designMode'];

export type IComponentHoc = {
  designMode: DesignMode | DesignMode[];
  hoc: IComponentConstruct,
};

export type IComponentConstruct = (Comp: types.IBaseRenderer, info: IComponentHocInfo) => types.Constructor;
// const whitelist: string[] = [];

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
}

// 缓存 Leaf 层组件，防止重新渲染问题
class LeafCache {
  constructor(public documentId: string) {
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
export function leafWrapper(Comp: types.IBaseRenderer, {
  schema,
  baseRenderer,
  componentInfo,
}: IComponentHocInfo) {
  const {
    __debug,
    __getComponentProps: getProps,
    __getSchemaChildrenVirtualDom: getChildren,
  } = baseRenderer;
  const engine = baseRenderer.context.engine;
  const host: BuiltinSimulatorHost = baseRenderer.props.__host;
  const curDocumentId = baseRenderer.props?.documentId;
  const getNode = baseRenderer.props?.getNode;
  const container: BuiltinSimulatorHost = baseRenderer.props.__container;
  const setSchemaChangedSymbol = baseRenderer.props?.setSchemaChangedSymbol;
  const editor = host?.designer?.editor;
  const { Component, forwardRef } = adapter.getRuntime();

  if (!cache || (curDocumentId && curDocumentId !== cache.documentId)) {
    cache?.event.forEach(event => {
      event.dispose?.forEach((disposeFn: any) => disposeFn && disposeFn());
    });
    cache = new LeafCache(curDocumentId);
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

  if (curDocumentId && cache.component.has(schema.componentName)) {
    return cache.component.get(schema.componentName);
  }

  class LeafHoc extends Component {
    recordInfo: {
      startTime?: number | null;
      type?: string;
      node?: Node;
    } = {};
    static displayName = schema.componentName;

    disposeFunctions: ((() => void) | Function)[] = [];

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

    get childrenMap(): any {
      const map = new Map();

      if (!this.hasChildren) {
        return map;
      }

      this.children.forEach((d: any) => {
        if (Array.isArray(d)) {
          map.set(d[0].props.componentId, d);
          return;
        }
        map.set(d.props.componentId, d);
      });

      return map;
    }

    get defaultState() {
      const {
        hidden = false,
      } = this.leaf?.schema || {};
      return {
        nodeChildren: null,
        childrenInState: false,
        visible: !hidden,
      };
    }

    constructor(props: IProps, context: any) {
      super(props, context);
      // 监听以下事件，当变化时更新自己
      __debug(`${schema.componentName}[${this.props.componentId}] leaf render in SimulatorRendererView`);
      clearRerenderEvent(this.props.componentId);
      const _leaf = this.leaf;
      this.initOnPropsChangeEvent(_leaf);
      this.initOnChildrenChangeEvent(_leaf);
      this.initOnVisibleChangeEvent(_leaf);
      this.curEventLeaf = _leaf;

      let cacheState = cache.state.get(props.componentId);
      if (!cacheState || cacheState.__tag !== props.__tag) {
        cacheState = this.defaultState;
      }

      this.state = cacheState;
    }

    private curEventLeaf;

    setState(state: any) {
      cache.state.set(this.props.componentId, {
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

    // get isInWhitelist() {
    //   return whitelist.includes(schema.componentName);
    // }

    componentWillReceiveProps(nextProps: any) {
      let { _leaf, componentId } = nextProps;
      if (nextProps.__tag === this.props.__tag) {
        return null;
      }

      _leaf = _leaf || getNode(componentId);
      if (_leaf && this.curEventLeaf && _leaf !== this.curEventLeaf) {
        this.disposeFunctions.forEach(fn => fn());
        this.disposeFunctions = [];
        this.initOnChildrenChangeEvent(_leaf);
        this.initOnPropsChangeEvent(_leaf);
        this.initOnVisibleChangeEvent(_leaf);
        this.curEventLeaf = _leaf;
      }

      this.setState({
        nodeChildren: null,
        nodeProps: {},
        childrenInState: false,
      });
    }

    /** 监听参数变化 */
    initOnPropsChangeEvent(leaf = this.leaf): void {
      const dispose = leaf?.onPropChange?.((propChangeInfo: PropChangeOptions) => {
        const {
          key,
        } = propChangeInfo;
        const node = leaf;

        // if (this.isInWhitelist) {
        //   container.rerender();
        //   return;
        // }

        // 如果循坏条件变化，从根节点重新渲染
        // 目前多层循坏无法判断需要从哪一层开始渲染，故先粗暴解决
        if (key === '___loop___') {
          __debug('key is ___loop___, render a page!');
          container.rerender();
          return;
        }

        this.beforeRender(RerenderType.PropsChanged);
        __debug(`${leaf?.componentName}[${this.props.componentId}] component trigger onPropsChange event`);
        const nextProps = getProps(node?.export?.(TransformStage.Render) as types.ISchema, Comp, componentInfo);
        this.setState(nextProps.children ? {
          nodeChildren: nextProps.children,
          nodeProps: nextProps,
        } : {
          nodeProps: nextProps,
        });
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

        // if (this.isInWhitelist) {
        //   container.rerender();
        //   return;
        // }

        __debug(`${leaf?.componentName}[${this.props.componentId}] component trigger onVisibleChange event`);
        this.beforeRender(RerenderType.VisibleChanged);
        this.setState({
          visible: flag,
        });
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
        // if (this.isInWhitelist) {
        //   container.rerender();
        //   return;
        // }
        this.beforeRender(`${RerenderType.ChildChanged}-${type}`, node);
        __debug(`${schema.componentName}[${this.props.componentId}] component trigger onChildrenChange event`);
        // TODO: 缓存同级其他元素的 children。
        // 缓存二级 children Next 查询筛选组件有问题
        // 缓存一级 children Next Tab 组件有问题
        const nextChild = getChildren(leaf?.export?.(TransformStage.Render) as types.ISchema, Comp); // this.childrenMap
        this.setState({
          nodeChildren: nextChild,
          childrenInState: true,
        });
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
      if (this.state.nodeChildren) {
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
      return this.props._leaf || getNode(this.props.componentId);
    }

    render() {
      if (!this.state.visible) {
        return null;
      }

      const {
        ref,
        ...rest
      } = this.props;

      const compProps = {
        ...rest,
        ...(this.state.nodeProps || {}),
        children: [],
        __id: this.props.componentId,
        ref: this.props.forwardedRef,
      };

      return engine.createElement(Comp, compProps, this.hasChildren ? this.children : null);
    }
  }

  const LeafWrapper = forwardRef((props: any, ref: any) => (
    // @ts-ignore
    <LeafHoc {...props} forwardedRef={ref} />
  ));

  if (typeof Comp === 'object') {
    const compExtraPropertyNames = Object.getOwnPropertyNames(Comp).filter(d => !compDefaultPropertyNames.includes(d));

    __debug(`${schema.componentName} extra property names: ${compExtraPropertyNames.join(',')}`);

    compExtraPropertyNames.forEach((d: string) => {
      (LeafWrapper as any)[d] = Comp[d];
    });
  }

  LeafWrapper.displayName = (Comp as any).displayName;

  if (curDocumentId) {
    cache.component.set(schema.componentName, LeafWrapper);
  }

  return LeafWrapper;
}