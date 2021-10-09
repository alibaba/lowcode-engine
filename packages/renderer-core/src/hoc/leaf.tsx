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
  LangChanged = 'LangChanged',
  I18nChanged = 'I18nChanged',
}

// 缓存 Leaf 层组件，防止重新渲染问题
let leafComponentCaches: {
  [componentName: string]: any;
} = {};

let cacheDocumentId: any;

function clearCaches(curDocumentId: any, {
  __debug,
}: any) {
  if (cacheDocumentId === curDocumentId) {
    return;
  }
  __debug(`DocumentId changed to ${curDocumentId}, clear caches!`);
  cacheDocumentId = curDocumentId;
  leafComponentCaches = {};
}

// 缓存导致 rerender 的订阅事件
const rerenderEventCache: {
  [componentId: string]: any;
} = {};

/** 部分没有渲染的 node 节点进行兜底处理 or 渲染方式没有渲染 LeafWrapper */
function initRerenderEvent({
  schema,
  __debug,
  container,
  getNode,
}: any) {
  const leaf = getNode?.(schema.id);
  if (!leaf
    || rerenderEventCache[schema.id]?.clear
    || leaf === rerenderEventCache[schema.id]?.leaf
  ) {
    return;
  }
  rerenderEventCache[schema.id]?.dispose.forEach((d: any) => d && d());
  rerenderEventCache[schema.id] = {
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
  };
}

/** 渲染的 node 节点全局注册事件清除 */
function clearRerenderEvent(id: string): void {
  if (!rerenderEventCache[id]) {
    rerenderEventCache[id] = {
      clear: true,
      dispose: [],
    };
    return;
  }
  rerenderEventCache[id].dispose.forEach((d: any) => d && d());
  rerenderEventCache[id].dispose = [];
  rerenderEventCache[id].clear = true;
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
  const editor = host?.designer?.editor;
  const { Component, forwardRef } = adapter.getRuntime();

  if (curDocumentId !== cacheDocumentId) {
    clearCaches(curDocumentId, {
      __debug,
    });
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

  if (leafComponentCaches[schema.componentName]) {
    return leafComponentCaches[schema.componentName];
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

    constructor(props: IProps, context: any) {
      super(props, context);
      // 监听以下事件，当变化时更新自己
      __debug(`${schema.componentName}[${this.props.componentId}] leaf render in SimulatorRendererView`);
      clearRerenderEvent(this.props.componentId);
      this.initOnPropsChangeEvent();
      this.initOnChildrenChangeEvent();
      this.initOnVisibleChangeEvent();
      this.state = {
        nodeChildren: null,
        childrenInState: false,
      };
    }

    /** 由于内部属性变化，在触发渲染前，会执行该函数 */
    beforeRender(type: string, node?: Node): void {
      this.recordInfo.startTime = Date.now();
      this.recordInfo.type = type;
      this.recordInfo.node = node;
    }

    // get isInWhitelist() {
    //   return whitelist.includes(schema.componentName);
    // }

    componentWillReceiveProps(nextProps: any) {
      const { _leaf } = nextProps;
      if (nextProps.__tag === this.props.__tag) {
        return null;
      }

      if (_leaf && this.leaf && _leaf !== this.leaf) {
        this.disposeFunctions.forEach(fn => fn());
        this.disposeFunctions = [];
        this.initOnChildrenChangeEvent(_leaf);
        this.initOnPropsChangeEvent(_leaf);
        this.initOnVisibleChangeEvent(_leaf);
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
        __debug(`${leaf?.componentName} component trigger onPropsChange event`);
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

        __debug(`${leaf?.componentName} component trigger onVisibleChange event`);
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
        __debug(`${leaf} component trigger onChildrenChange event`);
        const nextChild = getChildren(leaf?.export?.(TransformStage.Render) as types.ISchema, Comp, this.childrenMap);
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

    get visible(): boolean {
      if (typeof this.state.visible === 'boolean') {
        return this.state.visible;
      }
      if (typeof this.leaf?.schema?.hidden === 'boolean') {
        return !this.leaf?.schema?.hidden;
      }
      return true;
    }

    render() {
      if (!this.visible) {
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

  leafComponentCaches[schema.componentName] = LeafWrapper;

  return LeafWrapper;
}