import { InterpretDataSource as DataSource } from '@ali/lowcode-datasource-types';
import { ComponentsMap } from './npm';
import {
  CompositeValue,
  JSExpression,
  JSFunction,
  CompositeObject,
  JSONObject,
} from './value-type';
import { I18nMap } from './i18n';
import { UtilsMap } from './utils';
import { AppConfig } from './app-config';

// 转换成一个 .jsx 文件内 React Class 类 render 函数返回的 jsx 代码

/**
 * 搭建基础协议 - 单个组件树节点描述
 */
export interface NodeSchema {
  id?: string;
  /**
   * 组件名称 必填、首字母大写
   */
  componentName: string;
  /**
   * 组件属性对象
   */
  props?: PropsMap | PropsList;
  /**
   * 组件属性对象
   */
  leadingComponents?: string;
  /**
   * 渲染条件
   */
  condition?: CompositeValue;
  /**
   * 循环数据
   */
  loop?: CompositeValue;
  /**
   * 循环迭代对象、索引名称 ["item", "index"]
   */
  loopArgs?: [string, string];
  /**
   * 子节点
   */
  children?: NodeData | NodeData[];
  /**
   * 是否锁定
   */
  isLocked?: boolean;

  // @todo
  // ------- future support -----
  conditionGroup?: string;
  title?: string;
  ignore?: boolean;
  locked?: boolean;
  hidden?: boolean;
  isTopFixed?: boolean;
}

export type PropsMap = CompositeObject;
export type PropsList = Array<{
  spread?: boolean;
  name?: string;
  value: CompositeValue;
}>;

export type NodeData = NodeSchema | JSExpression | DOMText;
export type NodeDataType = NodeData | NodeData[];

export function isDOMText(data: any): data is DOMText {
  return typeof data === 'string';
}

export type DOMText = string;

/**
 * 容器结构描述
 */
export interface ContainerSchema extends NodeSchema {
  /**
   * 'Block' | 'Page' | 'Component';
   */
  componentName: string;
  /**
   * 文件名称
   */
  fileName: string;
  /**
   * @todo 待文档定义
   */
  meta?: Record<string, unknown>;
  /**
   * 容器初始数据
   */
  state?: {
    [key: string]: CompositeValue;
  };
  /**
   * 自定义方法设置
   */
  methods?: {
    [key: string]: JSExpression | JSFunction;
  };
  /**
   * 生命周期对象
   */
  lifeCycles?: {
    [key: string]: JSExpression | JSFunction;
  };
  /**
   * 样式文件
   */
  css?: string;
  /**
   * 异步数据源配置
   */
  dataSource?: DataSource;
  /**
   * 低代码业务组件默认属性
   */
  defaultProps?: CompositeObject;
  // @todo propDefinitions
}

/**
 * 页面容器
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface PageSchema extends ContainerSchema {
  componentName: 'Page';
}

/**
 * 低代码业务组件容器
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface ComponentSchema extends ContainerSchema {
  componentName: 'Component';
}

/**
 * 区块容器
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
 */
export interface BlockSchema extends ContainerSchema {
  componentName: 'Block';
}

/**
 * @todo
 */
export type RootSchema = PageSchema | ComponentSchema | BlockSchema;

/**
 * Slot schema 描述
 */
export interface SlotSchema extends NodeSchema {
  componentName: 'Slot';
  name?: string;
  params?: string[];
}

/**
 * 应用描述
 */
export interface ProjectSchema {
  id?: string;
  /**
   * 当前应用协议版本号
   */
  version: string;
  /**
   * 当前应用所有组件映射关系
   */
  componentsMap: ComponentsMap;
  /**
   * 描述应用所有页面、低代码组件的组件树
   * 低代码业务组件树描述
   * 是长度固定为1的数组, 即数组内仅包含根容器的描述（低代码业务组件容器类型）
   */
  componentsTree: RootSchema[];
  /**
   * 国际化语料
   */
  i18n?: I18nMap;
  /**
   * 应用范围内的全局自定义函数或第三方工具类扩展
   */
  utils?: UtilsMap;
  /**
   * 应用范围内的全局常量
   */
  constants?: JSONObject;
  /**
   * 应用范围内的全局样式
   */
  css?: string;
  /**
   * 当前应用的公共数据源
   */
  dataSource?: DataSource;
  /**
   * 当前应用配置信息
   */
  config?: AppConfig | Record<string, any>;
  /**
   * 当前应用元数据信息
   */
  meta?: Record<string, any>;
}

export function isNodeSchema(data: any): data is NodeSchema {
  return data && data.componentName;
}

export function isProjectSchema(data: any): data is ProjectSchema {
  return data && data.componentsTree;
}
