import type { ComponentLifecycle, CSSProperties } from 'react';
import { BuiltinSimulatorHost, BuiltinSimulatorRenderer } from '@alilc/lowcode-designer';
import { RequestHandler, IPublicTypeNodeSchema, IPublicTypeRootSchema, IPublicTypeJSONObject } from '@alilc/lowcode-types';

export type ISchema = IPublicTypeNodeSchema | IPublicTypeRootSchema;

/*
 ** Duck typed component type supporting both react and rax
 */
interface IGeneralComponent<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {
  readonly props: Readonly<P> & Readonly<{ children?: any | undefined }>;
  state: Readonly<S>;
  refs: Record<string, any>;
  context: any;
  setState<K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
  ): void;
  forceUpdate(callback?: () => void): void;
  render(): any;
}

export type IGeneralConstructor<
  T = {
    [key: string]: any;
  }, S = {
    [key: string]: any;
  }, D = any
> = new <TT = T, SS = S, DD = D>(props: TT, context: any) => IGeneralComponent<TT, SS, DD>;

/**
 * duck-typed History
 *
 * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md
 */
interface IHistoryLike {
  readonly action: any;
  readonly location: ILocationLike;
  createHref: (to: any) => string;
  push: (to: any, state?: any) => void;
  replace: (to: any, state?: any) => void;
  go: (delta: any) => void;
  back: () => void;
  forward: () => void;
  listen: (listener: any) => () => void;
  block: (blocker: any) => () => void;
}

/**
 * duck-typed History.Location
 *
 * @see https://github.com/remix-run/history/blob/dev/docs/api-reference.md#location
 */
export interface ILocationLike {
  pathname: any;
  search: any;
  state: any;
  hash: any;
  key?: any;
}

export type IRendererAppHelper = Partial<{

  /** 全局公共函数 */
  utils: Record<string, any>;

  /** 全局常量 */
  constants: Record<string, any>;

  /** react-router 的 location 实例 */
  location: ILocationLike;

  /** react-router 的 history 实例 */
  history: IHistoryLike;

  /** @deprecated 已无业务使用 */
  match: any;

  /** @experimental 内部使用 */
  logParams: Record<string, any>;

  /** @experimental 内部使用 */
  addons: Record<string, any>;

  /** @experimental 内部使用 */
  requestHandlersMap: Record<string, RequestHandler<{
    data: unknown;
  }>>;
}>;

/**
 * 渲染模块可用配置
 *
 * @see @todo @承虎
 */
export interface IRendererProps {

  /** 符合低代码搭建协议的数据 */
  schema: IPublicTypeRootSchema | IPublicTypeNodeSchema;

  /** 组件依赖的实例 */
  components: Record<string, IGeneralComponent>;

  /** CSS 类名 */
  className?: string;

  /** style */
  style?: CSSProperties;

  /** id */
  id?: string | number;

  /** 语言 */
  locale?: string;

  /**
   * 多语言语料
   * 配置规范参见《低代码搭建组件描述协议》https://lowcode-engine.cn/lowcode 中 2.6 国际化多语言支持
   * */
  messages?: Record<string, any>;

  /** 主要用于设置渲染模块的全局上下文，里面定义的内容可以在低代码中通过 this 来访问，比如 this.utils */
  appHelper?: IRendererAppHelper;

  /**
   * 配置规范参见《低代码搭建组件描述协议》https://lowcode-engine.cn/lowcode
   * 主要在搭建场景中使用，用于提升用户搭建体验。
   *
   * > 在生产环境下不需要设置
   */
  componentsMap?: { [key: string]: any };

  /** 设计模式，可选值：live、design */
  designMode?: string;

  /** 渲染模块是否挂起，当设置为 true 时，渲染模块最外层容器的 shouldComponentUpdate 将始终返回false，在下钻编辑或者多引擎渲染的场景会用到该参数。 */
  suspended?: boolean;

  /** 组件获取 ref 时触发的钩子 */
  onCompGetRef?: (schema: IPublicTypeNodeSchema, ref: any) => void;

  /** 组件 ctx 更新回调 */
  onCompGetCtx?: (schema: IPublicTypeNodeSchema, ref: any) => void;

  /** 传入的 schema 是否有变更 */
  getSchemaChangedSymbol?: () => boolean;

  /** 设置 schema 是否有变更 */
  setSchemaChangedSymbol?: (symbol: boolean) => void;

  /** 自定义创建 element 的钩子 */
  customCreateElement?: (Component: any, props: any, children: any) => any;

  /** 渲染类型，标识当前模块是以什么类型进行渲染的 */
  rendererName?: 'LowCodeRenderer' | 'PageRenderer' | string;

  /** 当找不到组件时，显示的组件 */
  notFoundComponent?: IGeneralComponent;

  /** 当组件渲染异常时，显示的组件 */
  faultComponent?: IGeneralComponent;

  /**  */
  faultComponentMap?: {
    [prop: string]: IGeneralComponent;
  };

  /** 设备信息 */
  device?: string;

  /**
   * @default true
   * JSExpression 是否只支持使用 this 来访问上下文变量
   */
  thisRequiredInJSE?: boolean;

  /**
   * @default false
   * 当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件
   */
  enableStrictNotFoundMode?: boolean;
}

export interface IRendererState {
  engineRenderError?: boolean;
  error?: Error;
}

/**
 * 渲染内部模块可用配置
 */
export interface IBaseRendererProps {
  locale?: string;
  messages: Record<string, any>;
  __appHelper: IRendererAppHelper;
  __components: Record<string, any>;
  __ctx: Record<string, any>;
  __schema: IPublicTypeRootSchema;
  __host?: BuiltinSimulatorHost;
  __container?: BuiltinSimulatorRenderer;
  config?: Record<string, any>;
  designMode?: 'design';
  className?: string;
  style?: CSSProperties;
  id?: string | number;
  getSchemaChangedSymbol?: () => boolean;
  setSchemaChangedSymbol?: (symbol: boolean) => void;
  thisRequiredInJSE?: boolean;
  documentId?: string;
  getNode?: any;

  /**
   * 设备类型，默认值：'default'
   */
  device?: 'default' | 'mobile' | string;
  componentName?: string;
}

export interface INodeInfo {
  schema?: IPublicTypeNodeSchema;
  Comp: any;
  componentInfo?: any;
  componentChildren?: any;
}

export interface JSExpression {
  type: string;
  value: string;
}

export interface DataSourceItem {
  id: string;
  isInit?: boolean | JSExpression;
  type?: string;
  options?: {
    uri: string | JSExpression;
    params?: IPublicTypeJSONObject | JSExpression;
    method?: string | JSExpression;
    shouldFetch?: string;
    willFetch?: string;
    fit?: string;
    didFetch?: string;
  };
  dataHandler?: JSExpression;
}

export interface DataSource {
  list?: DataSourceItem[];
  dataHandler?: JSExpression;
}

export interface IRuntime {
  [key: string]: any;
  Component: IGeneralConstructor;
  PureComponent: IGeneralConstructor;
  createElement: (...args: any) => any;
  createContext: (...args: any) => any;
  forwardRef: (...args: any) => any;
  findDOMNode: (...args: any) => any;
}

export interface IRendererModules {
  BaseRenderer?: IBaseRenderComponent;
  PageRenderer: IBaseRenderComponent;
  ComponentRenderer: IBaseRenderComponent;
  BlockRenderer?: IBaseRenderComponent;
  AddonRenderer?: IBaseRenderComponent;
  TempRenderer?: IBaseRenderComponent;
  DivRenderer?: IBaseRenderComponent;
}

export interface IBaseRendererContext {
  appHelper: IRendererAppHelper;
  components: Record<string, IGeneralComponent>;
  engine: IRuntime;
  pageContext?: IBaseRenderComponent;
  compContext?: IBaseRenderComponent;
}

export type IBaseRendererInstance = IGeneralComponent<
  IBaseRendererProps,
  Record<string, any>,
  any
>
  & {
    reloadDataSource(): Promise<any>;
    __beforeInit(props: IBaseRendererProps): void;
    __init(props: IBaseRendererProps): void;
    __afterInit(props: IBaseRendererProps): void;
    __executeLifeCycleMethod(method: string, args?: any[]): void;
    __bindCustomMethods(props: IBaseRendererProps): void;
    __generateCtx(ctx: Record<string, any>): void;
    __parseData(data: any, ctx?: any): any;
    __initDataSource(props: IBaseRendererProps): void;
    __render(): void;
    __getRef(ref: any): void;
    __getSchemaChildrenVirtualDom(
      schema: IPublicTypeNodeSchema | undefined,
      Comp: any,
      nodeChildrenMap?: any
    ): any;
    __getComponentProps(schema: IPublicTypeNodeSchema | undefined, scope: any, Comp: any, componentInfo?: any): any;
    __createDom(): any;
    __createVirtualDom(schema: any, self: any, parentInfo: INodeInfo, idx: string | number): any;
    __createLoopVirtualDom(schema: any, self: any, parentInfo: INodeInfo, idx: number | string): any;
    __parseProps(props: any, self: any, path: string, info: INodeInfo): any;
    __initDebug?(): void;
    __debug(...args: any[]): void;
    __renderContextProvider(customProps?: object, children?: any): any;
    __renderContextConsumer(children: any): any;
    __renderContent(children: any): any;
    __checkSchema(schema: IPublicTypeNodeSchema | undefined, extraComponents?: string | string[]): any;
    __renderComp(Comp: any, ctxProps: object): any;
    $(filedId: string, instance?: any): any;
  };

export interface IBaseRenderComponent {
  new(
    props: IBaseRendererProps,
    context: any
  ): IBaseRendererInstance;
}

export interface IRenderComponent {
  displayName: string;
  defaultProps: IRendererProps;
  findDOMNode: (...args: any) => any;

  new(props: IRendererProps, context: any): IGeneralComponent<IRendererProps, IRendererState> & {
    [x: string]: any;
    __getRef: (ref: any) => void;
    componentDidMount(): Promise<void> | void;
    componentDidUpdate(): Promise<void> | void;
    componentWillUnmount(): Promise<void> | void;
    componentDidCatch(e: any): Promise<void> | void;
    shouldComponentUpdate(nextProps: IRendererProps): boolean;
    isValidComponent(SetComponent: any): any;
    patchDidCatch(SetComponent: any): void;
    createElement(SetComponent: any, props: any, children?: any): any;
    getNotFoundComponent(): any;
    getFaultComponent(): any;
  };
}
