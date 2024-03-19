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

export interface UtilsApi {
  utils: Record<string, AnyFunction>;
}

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

export interface RouterApi {}
