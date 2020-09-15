// 搭建基础协议、搭建入料协议的数据规范
import { IExternalDependency } from './index';

/**
 * 搭建基础协议 - 函数表达式
 *
 * @export
 * @interface IJSExpression
 */
export interface IJSExpression {
  type: 'JSExpression';
  value: string;
  [extConfigName: string]: any;
}

/**
 * 搭建基础协议 - 函数定义
 *
 * @export
 * @interface IJSFunction
 */
export interface IJSFunction {
  type: 'JSFunction';
  value: string;
  [extConfigName: string]: any;
}

/**
 * 搭建基础协议 - 函数定义
 *
 * @export
 * @interface IJSSlot
 */
export interface IJSSlot {
  type: 'JSSlot';
  value: IComponentNodeItem[];
  params?: string[];
  [extConfigName: string]: any;
}

// JSON 基本类型
export interface IJSONObject {
  [key: string]: JSONValue;
}

export type JSONValue = boolean | string | number | null | JSONArray | IJSONObject;
export type JSONArray = JSONValue[];

export type CompositeArray = CompositeValue[];
export interface ICompositeObject {
  [key: string]: CompositeValue;
}

// 复合类型
export type CompositeValue = JSONValue | IJSExpression | IJSFunction | IJSSlot | CompositeArray | ICompositeObject;

/**
 * 搭建基础协议 - 多语言描述
 *
 * @export
 * @interface II18nMap
 */
export interface II18nMap {
  [lang: string]: {
    [key: string]: string;
  };
}

/**
 * 搭建基础协议
 *
 * @export
 * @interface IBasicSchema
 */
export interface IBasicSchema {
  version: string; // 当前协议版本号
  componentsMap: IComponentsMapItem[]; // 组件映射关系
  componentsTree: Array<IContainerNodeItem | IComponentNodeItem>; // 描述模版/页面/区块/低代码业务组件的组件树 低代码业务组件树描述，固定长度为1，且顶层为低代码业务组件容器描述
  utils?: IUtilItem[]; // 工具类扩展映射关系 低代码业务组件不包含
  i18n?: II18nMap; // 国际化语料
}

export interface IProjectSchema extends IBasicSchema {
  constants: Record<string, string>; // 应用范围内的全局常量；
  css: string; // 应用范围内的全局样式；
  config: IAppConfig; // 当前应用配置信息
  meta: IAppMeta; // 当前应用元数据信息
}

/**
 * 搭建基础协议 - 单个组件描述
 *
 * @export
 * @interface IComponentsMapItem
 */
export interface IComponentsMapItem extends IExternalDependency {
  componentName: string; // 组件名称
}

export interface IUtilItem {
  name: string;
  type: 'npm' | 'tnpm' | 'function';
  content: IExternalDependency | IJSExpression;
}

export type ChildNodeItem = string | IJSExpression | IComponentNodeItem;
export type ChildNodeType = ChildNodeItem | ChildNodeItem[];

/**
 * 搭建基础协议 - 单个组件树节点描述
 * 转换成一个 .jsx 文件内 React Class 类 render 函数返回的 jsx 代码
 *
 * @export
 * @interface IComponentNodeItem
 */
export interface IComponentNodeItem {
  // TODO: 不需要 id 字段，暂时简单兼容
  id?: string;
  componentName: string; // 组件名称 必填、首字母大写
  props: {
    [propName: string]: CompositeValue; // 业务属性
  }; // 组件属性对象
  condition?: CompositeValue; // 渲染条件
  loop?: CompositeValue; // 循环数据
  loopArgs?: [string, string]; // 循环迭代对象、索引名称 ["item", "index"]
  children?: ChildNodeType; // 子节点
}

/**
 * 搭建基础协议 - 单个容器节点描述
 *
 * @export
 * @interface IContainerNodeItem
 * @extends {IComponentNodeItem}
 */
export interface IContainerNodeItem extends IComponentNodeItem {
  componentName: 'Page' | 'Block' | 'Component'; // 'Page' | 'Block' | 'Component'  组件类型 必填、首字母大写
  fileName: string; // 文件名称 必填、英文
  state?: {
    [stateName: string]: CompositeValue; // 容器初始数据
  };
  css?: string; // 样式文件 用于描述容器组件内部节点的样式，对应生成一个独立的样式文件，在对应容器组件生成的 .jsx 文件中 import 引入；
  /**
   * LifeCycle
   * • constructor(props, context)
   * • 说明：初始化渲染时执行，常用于设置state值；
   * • render()
   * • 说明：执行于容器组件React Class的render方法最前，常用于计算变量挂载到this对象上，供props上属性绑定。此render()方法不需要设置return返回值。
   * • componentDidMount()
   * • componentDidUpdate(prevProps, prevState, snapshot)
   * • componentWillUnmount()
   * • componentDidCatch(error, info)
   */
  lifeCycles?: Record<string, IJSExpression | IJSFunction>; // 生命周期Hook方法
  methods?: Record<string, IJSExpression | IJSFunction>; // 自定义方法设置
  dataSource?: {
    list: IDataSourceConfig[];
  }; // 异步数据源配置
  meta?: IBasicMeta | IPageMeta;
}

/**
 * 搭建基础协议 - 数据源单个配置
 *
 * @export
 * @interface IDataSourceConfig
 */
export interface IDataSourceConfig {
  id: string; // 数据请求ID标识
  isInit: boolean; // 是否为初始数据 支持表达式 值为true时，将在组件初始化渲染时自动发送当前数据请求
  type: string; // 数据请求类型 'fetch' | 'mtop' | 'jsonp' | 'custom'
  requestHandler?: IJSExpression | IJSFunction; // 自定义扩展的外部请求处理器 仅type='custom'时生效
  options?: IFetchOptions; // 请求参数配置 每种请求类型对应不同参数
  dataHandler?: IJSExpression | IJSFunction; // 数据结果处理函数，形如：(data, err) => Object
}

/**
 * 搭建基础协议 - 请求参数配置
 *
 * @export
 * @interface IFetchOptions
 */
export interface IFetchOptions {
  url: string; // 请求地址 支持表达式
  params?: {
    // 请求参数
    [key: string]: any;
  };
  method: 'GET' | 'POST';
  isCors?: boolean; // 是否支持跨域，对应credentials = 'include'
  timeout?: number; // 超时时长
  headers?: {
    // 自定义请求头
    [key: string]: string;
  };
  [extConfigName: string]: any;
}

export interface IBasicMeta {
  title: string; // 标题描述
}

export interface IPageMeta extends IBasicMeta {
  router: string; // 页面路由
  spmb?: string; // spm
}

// "theme": {
//   //for Fusion use dpl defined
//   "package": "@alife/theme-fusion",
//   "version": "^0.1.0",

//   //for Antd use variable
//   "primary": "#ff9966"
// }

// "layout": {
//   "componentName": "BasicLayout",
//   "props": {
//     "logo": "...",
//     "name": "测试网站"
//   },
// },

export interface IAppConfig {
  sdkVersion: string; // 渲染模块版本
  historyMode: 'brower' | 'hash'; // 浏览器路由：brower  哈希路由：hash
  targetRootID: string; // 渲染根节点 ID
  layout: IComponentNodeItem;
  theme: Record<string, unknown>; // 主题配置，根据接入的主题模块不同
}

export interface IAppMeta {
  name: string; // 应用中文名称
  git_group?: string; // 应用对应git分组名
  project_name?: string; // 应用对应git的project名称
  description?: string; // 应用描述
  spma?: string; // 应用spma A位信息
  creator?: string; // author
  [otherAttrName: string]: any;
}
