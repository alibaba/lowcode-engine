import { NpmInfo } from './npm';
import { PropConfig } from './prop-config';
import { Snippet, ComponentMetadata } from './metadata';
import { I18nData } from './i18n';

/**
 * 定义组件大包及external资源的信息，应该被编辑器默认加载
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
   * @todo 待补充文档
   */
  async?: boolean;
  /**
   * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
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
   * 可用片段
   */
  snippets?: Snippet[];
  /**
   * 一级分组
   */
  group?: string | I18nData;

  /**
   * 二级分组
   */
  category?: string | I18nData;

  /**
   * 组件优先级排序
   */
  priority?: number;
}

/**
 * 本地物料描述
 */
export interface ComponentDescription extends ComponentMetadata {
  /**
   * @todo 待补充文档
   */
  keywords: string[];
}

/**
 * 远程物料描述
 */
export interface RemoteComponentDescription {
  /**
   * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
   */
  exportName?: string;
  /**
   * 组件描述的资源链接；
   */
  url?: string;
  /**
   * 组件(库)的 npm 信息；
   */
  package?: {
    npm?: string;
  };
}
