import { NpmInfo } from './npm';
import { PropConfig } from './prop-config';
import { Snippet, ComponentMetadata } from './metadata';

/**
 * 应该被编辑器默认加载，定义组件大包及external资源的信息
 */
export interface Package {
  /**
   * 包名
   */
  package: string;
  /**
   * 包版本号
   */
  version: string;
  /**
   * 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css
   */
  urls?: string[] | any;
  /**
   * 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css
   */
  editUrls?: string[] | any;
  /**
   * 作为全局变量引用时的名称，和webpack output.library字段含义一样，用来定义全局变量名
   */
  library: string;
  /**
   * 待补充文档
   */
  async?: boolean;
  /**
   * 待补充文档
   */
  exportName?: string;
}

/**
 * 组件分类
 */
export interface ComponentCategory {
  /**
   * 组件分类title
   */
  title: string;
  /**
   * 组件分类icon
   */
  icon?: string;
  /**
   * 可能有子分类
   */
  children?: ComponentItem[] | ComponentCategory[];
}

/**
 * 组件
 */
export interface ComponentItem {
  /**
   * 组件title
   */
  title: string;
  /**
   * 组件名
   */
  componentName?: string;
  /**
   * 组件icon
   */
  icon?: string;
  /**
   * 待补充文档
   */
  snippets?: Snippet[];
}

/**
 * 本地物料描述
 */
export interface ComponentDescription extends ComponentMetadata {
  /**
   * 待补充文档
   */
  keywords: string[];
}

/**
 * 远程物料描述
 */
export interface RemoteComponentDescription {
  /**
   * 待补充文档
   */
  exportName: string;
  /**
   * 待补充文档
   */
  url: string;
}
