/**
 * https://lowcode-engine.cn/site/docs/specs/lowcode-spec
 * 低代码引擎搭建协议规范
 */
import { JSONObject, JSONValue } from '../json';
import { Reference } from './material-spec';

/**
 * https://lowcode-engine.cn/site/docs/specs/lowcode-spec#2-%E5%8D%8F%E8%AE%AE%E7%BB%93%E6%9E%84
 * 应用协议
 */
export interface Project {
  /**
   * 当前协议版本号
   */
  version: string;
  /**
   * 组件映射关系
   */
  componentsMap: ComponentMap[];
  /**
   * 描述模版/页面/区块/低代码业务组件的组件树
   */
  componentsTree: ComponentTree[];
  /**
   * 工具类扩展映射关系
   */
  utils?: UtilDescription[];
  /**
   * 国际化语料
   */
  i18n?: LocaleTranslationsMap;
  /**
   * 应用范围内的全局常量
   */
  constants?: ConstantsMap;
  /**
   * 应用范围内的全局样式
   * 用于描述在应用范围内的全局样式，比如 reset.css 等。
   */
  css?: string;
  /**
   * 当前应用配置信息
   */
  config?: ProjectConfig;
  /**
   * 当前应用元数据信息
   */
  meta?: Record<string, JSONValue | JSONObject>;
  /**
   * 当前应用的公共数据源
   * @deprecated
   */
  // dataSource?: never;
  /**
   * 当前应用的路由配置信息
   */
  router?: RouterConfig;
  /**
   * 当前应用的所有页面信息
   */
  pages?: PageConfig[];
}

/**
 * 当前应用配置信息
 */
export interface ProjectConfig {
  /**
   * 默认语言配置，不填则为 navagator.language
   */
  defaultLocale?: string;
  /**
   * 布局组件配置
   */
  layout?: {
    componentName: string;
    props: Record<string, JSONObject>;
  };
  /**
   * 默认挂载 dom 节点
   */
  targetRootID?: string;

  // todo
  theme?: any;

  [key: string]: any;
}

/**
 * https://lowcode-engine.cn/site/docs/specs/lowcode-spec#22-%E7%BB%84%E4%BB%B6%E6%98%A0%E5%B0%84%E5%85%B3%E7%B3%BBa
 * 协议中用于描述 componentName 到公域组件映射关系的规范。
 */
export interface ComponentMap extends Reference {
  /**
   * 协议中的组件名，对应包导出的组件名，是一个有效的 JS 标识符
   */
  componentName: string;

  devMode?: 'lowCode' | 'proCode';
}

/**
 * 组件树描述
 * 协议中用于描述搭建出来的组件树结构的规范，整个组件树的描述由组件结构&容器结构两种结构嵌套构成。
 */
export type ComponentTree = ComponentTreeRoot;

/**
 * 根容器节点结构描述 (A)
 * 容器是一类特殊的组件，在组件能力基础上增加了对生命周期对象、自定义方法、样式文件、数据源等信息的描述。
 */
export interface ComponentTreeRoot extends ComponentNode {
  componentName: 'Page' | 'Block' | 'Component';
  /**
   * 文件名称
   */
  fileName: string;
  /**
   * 容器初始数据
   */
  state?: Record<string, JSONValue | JSExpression>;
  /**
   * 样式属性
   */
  css?: string;
  /**
   * 生命周期对象
   */
  lifeCycles?: {
    [name in ComponentLifeCycle]: JSFunction;
  };
  /**
   * 自定义方法对象
   */
  methods?: {
    [name: string]: JSFunction;
  };
  /**
   * 数据源对象
   * type todo
   */
  dataSource?: ComponentDataSource;

  // for useless
  loop: never;
  loopArgs: never;
  condition: never;
}

export type ComponentLifeCycle =
  | 'constructor'
  | 'render'
  | 'componentDidMount'
  | 'componentDidUpdate'
  | 'componentWillUnmount'
  | 'componentDidCatch';

/**
 * 组件数据源描述
 */
export interface ComponentDataSource {
  /**
   * 数据源列表
   */
  list: ComponentDataSourceItem[];
  /**
   * 所有请求数据的处理函数
   */
  dataHandler: JSFunction;
}

/**
 * 请求配置
 */
export interface ComponentDataSourceItem {
  /**
   * 数据请求 ID 标识
   */
  id: string;
  /**
   * 是否为初始数据
   * 值为 true 时，将在组件初始化渲染时自动发送当前数据请求
   */
  isInit: boolean | JSExpression;
  /**
   * 是否需要串行执行
   * 值为 true 时，当前请求将被串行执行
   */
  isSync: boolean | JSExpression;
  /**
   * 数据请求类型
   */
  type: string;
  /**
   * 自定义扩展的外部请求处理器
   */
  requestHandler?: JSFunction;
  /**
   * request 成功后的回调函数
   * 参数为请求成功后 promise 的 value 值
   */
  dataHandler?: JSFunction;
  /**
   * request 失败后的回调函数
   * 参数为请求出错 promise 的 error 内容
   */
  errorHandler?: JSFunction;
  /**
   * 请求配置参数
   */
  options?: ComponentDataSourceItemOptions;

  [otherKey: string]: any;
}

/**
 * 请求配置参数
 */
export interface ComponentDataSourceItemOptions {
  /**
   * 请求地址
   */
  uri: string | JSExpression;
  /**
   * 请求参数
   */
  params?: JSONObject | JSExpression;
  /**
   * 请求方法
   */
  method?: string | JSExpression;
  /**
   * 是否支持跨域
   * 对应 credentials = 'include'
   */
  isCors?: boolean | JSExpression;
  /**
   * 超时时长
   */
  timeout?: number | JSExpression;
  /**
   * 请求头信息
   */
  headers?: JSONObject | JSExpression;

  [option: string]: any;
}

/**
 * 组件结构描述（A）
 */
export interface ComponentNode {
  /**
   * 组件唯一标识
   */
  id?: string;
  /**
   * 组件名称
   */
  componentName: string;
  /**
   * 默认 props
   */
  defaultProps?: JSONObject;
  /**
   * 组件 props 对象
   */
  props?: ComponentNodeProps;
  /**
   * 选填，根据表达式结果判断是否渲染物料；
   */
  condition?: boolean | JSExpression;
  /**
   * 循环数据
   */
  loop?: unknown[] | JSExpression;
  /**
   * 循环迭代对象、索引名称，默认为 ["item", "index"]
   */
  loopArgs?: [string, string];
  /**
   * 子组件
   */
  children?: NodeType[];
}

/**
 * Props 结构描述
 */
export interface ComponentNodeProps {
  /** 组件 ID */
  id?: string | JSExpression;
  /** 组件样式类名 */
  className?: string;
  /**  组件内联样式 */
  style?: JSONObject | JSExpression;
  /** 组件 ref 名称 */
  ref?: string;

  [key: string]: any;
}

export interface NPMUtil {
  name: string;
  type: 'npm';
  content: Reference;
}

export interface FunctionUtil {
  name: string;
  type: 'function';
  content: JSFunction;
}

/**
 * https://lowcode-engine.cn/site/docs/specs/lowcode-spec#24-%E5%B7%A5%E5%85%B7%E7%B1%BB%E6%89%A9%E5%B1%95%E6%8F%8F%E8%BF%B0aa
 * 用于描述物料开发过程中，自定义扩展或引入的第三方工具类（例如：lodash 及 moment），增强搭建基础协议的扩展性，提供通用的工具类方法的配置方案及调用 API。
 */
export type UtilDescription = NPMUtil | FunctionUtil;

/**
 * https://lowcode-engine.cn/site/docs/specs/lowcode-spec#25-%E5%9B%BD%E9%99%85%E5%8C%96%E5%A4%9A%E8%AF%AD%E8%A8%80%E6%94%AF%E6%8C%81aa
 * 国际化多语言支持
 */
export interface I18nTranslations {
  [key: string]: string;
}

export interface LocaleTranslationsMap {
  [locale: string]: I18nTranslations;
}

/**
 * 应用范围内的全局常量（AA）
 * 用于描述在整个应用内通用的全局常量，比如请求 API 的域名、环境等。
 */
export interface ConstantsMap {
  [key: string]: JSONValue;
}

/**
 * https://lowcode-engine.cn/site/docs/specs/lowcode-spec#211-%E5%BD%93%E5%89%8D%E5%BA%94%E7%94%A8%E7%9A%84%E8%B7%AF%E7%94%B1%E4%BF%A1%E6%81%AFaa
 * 当前应用的路由信息（AA）
 * 用于描述当前应用的路径 - 页面的关系。通过声明路由信息，应用能够在不同的路径里显示对应的页面。
 */
export interface RouterConfig {
  /**
   * 应用根路径
   */
  baseName: string;
  /**
   * 路由的 history 模式
   */
  historyMode: 'browser' | 'hash' | 'memory';
  /**
   * 路由对象组，路径与页面的关系对照组
   */
  routes: RouteRecord[];
}

/**
 * Route （路由记录）结构描述
 * 路由记录，路径与页面的关系对照。Route 的结构说明：
 */
export interface RouteRecord {
  /**
   * 该路径项的名称
   */
  name?: string;
  /**
   * 路径
   */
  path: string;
  /**
   * 路径对应的页面 ID，page 与 redirect 字段中必须要有有一个存在
   */
  page?: string;
  /**
   * 此路径需要重定向到的路由信息，page 与 redirect 字段中必须要有有一个存在
   */
  redirect?: string | object | JSFunction;
  /**
   * 子路由
   */
  children?: RouteRecord[];
}

/**
 * 当前应用的页面信息（AA）
 * 用于描述当前应用的页面信息，比如页面对应的低代码搭建内容、页面标题、页面配置等。
 * 在一些比较复杂的场景下，声明一层页面映射关系，以支持页面声明更多信息与配置，同时能够支持不同类型的产物。
 */
export interface PageConfig {
  /**
   * 页面 id
   */
  id: string;
  /**
   * 页面类型，如 componentsTree，package，默认为 componentsTree
   */
  type?: string;
  /**
   * 映射的 id，根据页面的类型 type 判断及确定目标的 id
   */
  mappingId: string;
  /**
   * 页面元信息
   */
  meta?: JSONObject;
  /**
   * 页面配置
   */
  config?: JSONObject;
}

export interface JSNode {
  type: string;
  [key: string]: any;
}

/**
 * 节点类型（A）
 * 通常用于描述组件的某一个属性为 Node 或 Function-Return-Node 的场景。
 */
export interface JSSlot extends JSNode {
  type: 'JSSlot';
  value: ComponentNode | ComponentNode[];
  params?: string[];

  [key: string]: any;
}

/**
 * 事件函数类型（A）
 */
export interface JSFunction extends JSNode {
  type: 'JSFunction';
  value: string;

  [key: string]: any;
}

/**
 * 变量类型（A）
 */
export interface JSExpression extends JSNode {
  type: 'JSExpression';
  value: string;

  [key: string]: any;
}

/**
 * 国际化多语言类型（AA）
 */
export interface JSI18n extends JSNode {
  type: 'i18n';
  /**
   * i18n 结构中字段的 key 标识符
   */
  key: string;
  /**
   * 语料为字符串模板时的变量内容
   */
  params?: Record<string, string | number | JSExpression>;
}

export type NodeType = string | JSExpression | JSI18n | ComponentNode;
