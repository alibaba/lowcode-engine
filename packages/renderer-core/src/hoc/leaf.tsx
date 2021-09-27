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

const whitelist: string[] = [];

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
  const getNode = baseRenderer.props?.getNode;
  const container: BuiltinSimulatorHost = baseRenderer.props.__container;
  const editor = host?.designer?.editor;
  const { Component } = adapter.getRuntime();

  if (!isReactComponent(Comp)) {
    console.error(`${schema.componentName} component may be has errors: `, Comp);
  }

  /** 部分没有渲染的 node 节点进行兜底处理 or 渲染方式没有渲染 LeafWrapper */
  let wrapDisposeFunctions: Function[] = [];
  if (getNode) {
    const leaf = getNode(schema.id);

    wrapDisposeFunctions = [
      leaf?.onPropsChange?.(() => container.rerender()),
      leaf?.onChildrenChange?.(() => container.rerender()),
      leaf?.onVisibleChange?.(() => container.rerender()),
    ];
  }

  class LeafWrapper extends Component {
    recordInfo: {
      startTime?: number | null;
      type?: string;
      node?: Node;
    } = {};

    static displayName = schema.componentName;

    disposeFunctions: ((() => void) | Function)[] = [];

    recordTime = () => {
      if (!this.recordInfo.startTime) {
        return;
      }
      const endTime = Date.now();
      const nodeCount = host.designer.currentDocument?.getNodeCount?.();
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

    constructor(props: IProps, context: any) {
      super(props, context);
      // 监听以下事件，当变化时更新自己
      this.initOnPropsChangeEvent();
      this.initOnChildrenChangeEvent();
      this.initOnVisibleChangeEvent();
      wrapDisposeFunctions.forEach(d => d && d());
      this.state = {
        nodeChildren: null,
        childrenInState: false,
        __tag: props.__tag,
      };
    }

    /** 由于内部属性变化，在触发渲染前，会执行该函数 */
    beforeRender(type: string, node?: Node): void {
      this.recordInfo.startTime = Date.now();
      this.recordInfo.type = type;
      this.recordInfo.node = node;
    }

    get isInWhitelist() {
      return whitelist.includes(schema.componentName);
    }

    static getDerivedStateFromProps(props: any, state: any) {
      if (props.__tag === state.__tag) {
        return null;
      }

      return {
        nodeChildren: props.children,
        nodeProps: props.nodeProps,
        childrenInState: true,
        __tag: props.__tag,
      };
    }

    shouldComponentUpdate() {
      if (this.isInWhitelist) {
        __debug(`${schema.componentName} is in leaf Hoc whitelist`);
        container.rerender();
        return false;
      }

      return true;
    }

    /** 监听参数变化 */
    initOnPropsChangeEvent(): void {
      const dispose = this.leaf?.onPropChange?.((propChangeInfo: PropChangeOptions) => {
        const {
          key,
        } = propChangeInfo;
        const node = this.leaf;

        // 如果循坏条件变化，从根节点重新渲染
        // 目前多层循坏无法判断需要从哪一层开始渲染，故先粗暴解决
        if (key === '___loop___') {
          __debug('key is ___loop___, render a page!');
          container.rerender();
          return;
        }

        this.beforeRender(RerenderType.PropsChanged);
        __debug(`${this.leaf?.componentName} component trigger onPropsChange event`);
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
    initOnVisibleChangeEvent() {
      const dispose = this.leaf?.onVisibleChange?.((flag: boolean) => {
        if (this.state.visible === flag) {
          return;
        }

        __debug(`${this.leaf?.componentName} component trigger onVisibleChange event`);
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
    initOnChildrenChangeEvent() {
      const dispose = this.leaf?.onChildrenChange?.((param): void => {
        const {
          type,
          node,
        } = param || {};
        this.beforeRender(`${RerenderType.ChildChanged}-${type}`, node);
        __debug(`${this.leaf} component trigger onChildrenChange event`);
        const nextChild = getChildren(this.leaf?.export?.(TransformStage.Render) as types.ISchema, Comp);
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
      if (this.state.childrenInState) {
        return !!this.state.nodeChildren?.length;
      }

      if (Array.isArray(this.props.children)) {
        return Boolean(this.props.children && this.props.children.length);
      }

      return Boolean(this.props.children);
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

      const compProps = {
        ...this.props,
        ...(this.state.nodeProps || {}),
        children: [],
        __id: this.props.componentId,
      };

      return engine.createElement(Comp, compProps, this.hasChildren ? this.children : null);
    }
  }

  if (typeof Comp === 'object') {
    const compExtraPropertyNames = Object.getOwnPropertyNames(Comp).filter(d => !compDefaultPropertyNames.includes(d));

    __debug(`${schema.componentName} extra property names: ${compExtraPropertyNames.join(',')}`);

    compExtraPropertyNames.forEach((d: string) => {
      (LeafWrapper as any)[d] = Comp[d];
    });
  }

  LeafWrapper.displayName = (Comp as any).displayName;

  return LeafWrapper;
}
