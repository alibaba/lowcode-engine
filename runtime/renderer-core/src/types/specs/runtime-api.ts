import { AnyFunction, PlainObject } from '../common';

/**
 * 在上述事件类型描述和变量类型描述中，在函数或 JS 表达式内，均可以通过 this 对象获取当前组件所在容器的实例化对象
 * 在搭建场景下的渲染模块和出码模块实现上，统一约定了该实例化 this 对象下所挂载的最小 API 集合，
 * 以保障搭建协议具备有一致的数据流和事件上下文
 */
export interface InstanceApi<InstanceT = unknown> extends InstanceStateApi, InstanceDataSourceApi {
  /**
   * 容器的 props 对象
   */
  props?: PlainObject;
  /**
   * ref 对应组件上配置的 ref 属性，用于唯一标识一个组件；若有同名的，则会返回第一个匹配的。
   * @param ref 组件标识
   */
  $(ref: string): InstanceT | undefined;
  /**
   * ref 对应组件上配置的 ref 属性，用于唯一标识一个组件；总是返回一个数组，里面是所有匹配 ref 的组件的引用。
   * @param ref 组件标识
   */
  $$(ref: string): InstanceT[];

  [methodName: string]: any;
}

export interface InstanceStateApi<S = PlainObject> {
  /**
   * 实例的数据对象 state
   */
  state: Readonly<S>;
  /**
   * 实例更新数据的方法
   * like React.Component.setState
   */
  setState<K extends keyof S>(
    newState: ((prevState: Readonly<S>) => Pick<S, K> | S | null) | (Pick<S, K> | S | null),
    callback?: () => void,
  ): void;
}

export interface InstanceDataSourceApi {
  /**
   * 实例的数据源对象 Map
   */
  dataSourceMap: any;
  /**
   * 实例的初始化异步数据请求重载
   */
  reloadDataSource: () => void;
}

/**
 * 应用级别的公共函数或第三方扩展
 */
export interface UtilsApi {
  utils: Record<string, AnyFunction>;
}

/**
 * 国际化相关 API
 */
export interface IntlApi {
  /**
   * 返回语料字符串
   * @param i18nKey 语料的标识符
   * @param params 可选，是用来做模版字符串替换
   */
  i18n(i18nKey: string, params?: Record<string, string>): string;
  /**
   * 返回当前环境语言
   */
  getLocale(): string;
  /**
   * 设置当前环境语言
   * @param locale 环境语言
   */
  setLocale(locale: string): void;
}

/**
 * 路由 Router API：封装了原生的 History、Location 等 api，提供统一的调用方法
 * 得益于 HTML 5 新的 History api 的规范出现，SPA 大行其道，其中 SPA 的路由起到了非常重大的作用
 */
export interface RouterApi {
  /**
   * 获取当前解析后的路由信息
   */
  getCurrentLocation(): RouteLocation;
  /**
   * 路由跳转方法，跳转到指定的路径或者 `Route`
   */
  push(location: RawRouteLocation): void | Promise<void>;
  /**
   * 路由跳转方法，与 `push` 的区别在于不会增加一条历史记录而是替换当前的历史记录
   */
  replace(location: RawRouteLocation): void | Promise<void>;
  /**
   * 返回上一页，同 `history.back`
   */
  back(): void;
  /**
   * 跳转下一页，同 `history.forward`
   */
  forward(): void;
  /**
   * 跳转到当前页面的相对位置，同 `history.go`
   * @param delta 相对于当前页面你要去往历史页面的位置
   */
  go(delta: number): void;
  /**
   * 路由跳转前的守卫方法
   */
  beforeRouteLeave(
    guard: (to: RouteLocation, from: RouteLocation) => boolean | Promise<boolean>,
  ): () => void;
  /**
   * 路由跳转后的钩子函数
   */
  afterRouteChange(guard: (to: RouteLocation, from: RouteLocation) => any): () => void;
}

export interface RawLocationAsPath {
  path: string;
}
export interface RawLocationAsRelative {
  params?: Record<string, string | string[]>;
}
export interface RawLocationAsName {
  name: string;
  params?: Record<string, string | string[]>;
}

export type RawLocation = RawLocationAsPath | RawLocationAsRelative | RawLocationAsName;

export interface RawLocationOptions {
  searchParams?: URLSearchParams;
  hash?: string;
  state?: History['state'];
}

/**
 * 允许用户输入的路径参数类型
 */
export type RawRouteLocation = string | (RawLocation & RawLocationOptions);

/**
 * 路由的当前信息，模拟 window.location
 */
export interface RouteLocation {
  /**
   * 匹配到的路由记录名
   */
  name: string | undefined;
  /**
   * 当前解析后的路径
   */
  path: string;
  /**
   * 当前路径的 hash 值，以 # 开头
   */
  hash: string;
  /**
   * 匹配到的路径参数
   */
  params: Record<string, string | string[]> | undefined;
  /**
   * 当前的路径 URLSearchParams 对象
   */
  searchParams: URLSearchParams | undefined;
  /**
   * 包括 search 和 hash 在内的完整地址
   */
  fullPath: string;
  /**
   * 匹配到的路由记录元数据
   */
  meta: PlainObject | undefined;
  /**
   * 重定向之前的路由，在跳转到当前路径之前的路由记录
   */
  redirectedFrom: RouteLocation | undefined;
}
