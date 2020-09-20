import { ComponentsMap } from './npm';
import { CompositeValue, JSExpression, JSFunction, CompositeObject, JSONObject } from './value-type';
import { DataSource } from './data-source';
import { I18nMap } from './i18n';
import { UtilsMap } from './utils';

// 搭建基础协议 - 单个组件树节点描述
// 转换成一个 .jsx 文件内 React Class 类 render 函数返回的 jsx 代码
export interface NodeSchema {
  id?: string;
  componentName: string; // 组件名称 必填、首字母大写
  props?: PropsMap | PropsList; // 组件属性对象
  leadingComponents?: string;
  condition?: CompositeValue; // 渲染条件
  loop?: CompositeValue; // 循环数据
  loopArgs?: [string, string]; // 循环迭代对象、索引名称 ["item", "index"]
  children?: NodeData | NodeData[]; // 子节点

  // ------- future support -----
  conditionGroup?: string;
  title?: string;
  ignore?: boolean;
  locked?: boolean;
  hidden?: boolean;
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

export interface ContainerSchema extends NodeSchema {
  componentName: string; // 'Block' | 'Page' | 'Component';
  fileName: string;
  meta?: Record<string, unknown>;
  state?: {
    [key: string]: CompositeValue;
  };
  methods?: {
    [key: string]: JSExpression | JSFunction;
  };
  lifeCycles?: {
    [key: string]: JSExpression | JSFunction;
  };
  css?: string;
  dataSource?: DataSource;
  defaultProps?: CompositeObject;
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

export type RootSchema = PageSchema | ComponentSchema | BlockSchema;

export interface SlotSchema extends NodeSchema {
  componentName: 'Slot';
  params?: string[];
}

export interface ProjectSchema {
  version: string;
  componentsMap: ComponentsMap;
  componentsTree: RootSchema[];
  i18n?: I18nMap;
  utils?: UtilsMap;
  constants?: JSONObject;
  css?: string;
  dataSource?: DataSource;
  id?: string;
  config?: Record<string, any>;
  meta?: Record<string, any>;
}

export function isNodeSchema(data: any): data is NodeSchema {
  return data && data.componentName;
}

export function isProjectSchema(data: any): data is ProjectSchema {
  return data && data.componentsTree;
}
