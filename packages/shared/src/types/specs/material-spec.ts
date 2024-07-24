/**
 * 组件描述协议
 * 对源码组件在低代码搭建平台中使用时所具备的配置能力和交互行为进行规范化描述，让不同平台对组件接入的实现保持一致，
 * 让组件针对不同的搭建平台接入时可以使用一份统一的描述内容，让组件在不同的业务中流通成为可能。
 */
import { ComponentTree, ComponentNode } from './lowcode-spec';
import { StringDictionary } from '../index';
import { Package } from './asset-spec';

export interface LowCodeComponentTree extends ComponentTree {
  componentName: 'Component';
}

/**
 * 组件基础信息
 */
export interface ComponentMetaData<Configure extends StringDictionary = StringDictionary> {
  /**
   * 组件名
   */
  componentName: string;
  /**
   * 组件名称
   */
  title: string;
  /**
   * 组件描述
   */
  description?: string;
  /**
   * 组件的小图标 string or url
   */
  icon?: string;
  /**
   * 组件标签
   */
  tags?: string[];
  /**
   * 组件文档链接
   */
  docUrl?: string;
  /**
   * 组件快照
   */
  screenshot?: string;
  /**
   * 组件关键词，用于搜索联想
   */
  keywords?: string;
  /**
   * 一级分组
   */
  group?: string;
  /**
   * 二级分组
   */
  category?: string;
  /**
   * 组件优先级排序
   */
  priority?: number;

  /**
   * 组件研发模式
   */
  devMode?: 'proCode' | 'lowCode';
  /**
   * 引用完整描述对象
   */
  reference?: Reference;
  /**
   * 低代码组件 schema
   */
  schema?: LowCodeComponentTree;

  /**
   * 可用片段
   */
  snippets?: Snippet[];
  /**
   * 组件属性信息
   */
  props?: PropConfig[];
  /**
   * 编辑体验增强
   */
  configure?: Configure;

  /** 其他扩展协议 */
  [key: string]: any;
}

/**
 * 引用完整描述对象
 */
export interface Reference {
  /**
   * 引用资源的 id 标识
   */
  id?: string;
  /**
   * 资源版本号
   */
  version: string;
  /**
   * 包名
   */
  package?: string;
  /**
   * 导出名称
   */
  exportName?: string;
  /**
   * 子组件名
   */
  subName?: string;
}

/**
 * 组件属性信息
 */
export interface PropConfig {
  /**
   * 属性名称
   */
  name: string;
  /**
   * 属性类型
   */
  propType: PropType;
  /**
   * 属性描述
   */
  description?: string;
  /**
   * 属性默认值
   */
  defaultValue?: any;
}

export type PropType = PropBasicType | PropRequiredType | PropComplexType;
export type PropBasicType =
  | 'array'
  | 'bool'
  | 'func'
  | 'number'
  | 'object'
  | 'string'
  | 'node'
  | 'element'
  | 'any';
export type PropComplexType =
  | PropOneOf
  | PropOneOfType
  | PropArrayOf
  | PropObjectOf
  | PropShape
  | PropExact
  | PropInstanceOf;

export interface PropRequiredType {
  type: PropBasicType;
  isRequired?: boolean;
}

export interface PropOneOf {
  type: 'oneOf';
  value: string[];
  isRequired?: boolean;
}
export interface PropOneOfType {
  type: 'oneOfType';
  value: PropType[];
  isRequired?: boolean;
}
export interface PropArrayOf {
  type: 'arrayOf';
  value: PropType;
  isRequired?: boolean;
}
export interface PropObjectOf {
  type: 'objectOf';
  value: PropType;
  isRequired?: boolean;
}
export interface PropShape {
  type: 'shape';
  value: PropConfig[];
  isRequired?: boolean;
}
export interface PropExact {
  type: 'exact';
  value: PropConfig[];
  isRequired?: boolean;
}
export interface PropInstanceOf {
  type: 'instanceOf';
  value: PropConfig;
  isRequired?: boolean;
}

/**
 * 可用片段
 *
 * 内容为组件不同状态下的低代码 schema (可以有多个)，用户从组件面板拖入组件到设计器时会向页面 schema 中插入 snippets 中定义的组件低代码 schema
 */
export interface Snippet {
  /**
   * 组件分类 title
   */
  title?: string;
  /**
   * snippet 截图
   */
  screenshot?: string;
  /**
   * 待插入的 schema
   */
  schema?: ComponentNode;
}

export interface ProCodeComponent extends Package {
  package: string;
  type: 'proCode';
  library: string;
}

export interface LowCodeComponent extends Package {
  id: string;
  type: 'lowCode';
  componentName: string;
  schema: LowCodeComponentTree;
}
