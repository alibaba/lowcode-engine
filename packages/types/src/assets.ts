import { NpmInfo } from './npm';
import { PropConfig } from './prop-config';
import { Snippet, ComponentMetadata } from './metadata';

export interface Package { // 应该被编辑器默认加载，定义组件大包及external资源的信息
  package: string; // 包名
  version: string; // 包版本号
  urls?: string[] | any; // 组件渲染态视图打包后的 CDN url 列表，包含 js 和 css
  editUrls?: string[] | any; // 组件编辑态视图打包后的 CDN url 列表，包含 js 和 css
  library: string; // 作为全局变量引用时的名称，和webpack output.library字段含义一样，用来定义全局变量名
  async?: boolean,
  exportName?: string;
}

export interface ComponentCategory { // 组件分类
  title: string; // 组件分类title
  icon?: string; // 组件分类icon
  children?: ComponentItem[] | ComponentCategory[]; // 可能有子分类
}

export interface ComponentItem { // 组件
  title: string; // 组件title
  componentName?: string; // 组件名
  icon?: string; // 组件icon
  snippets?: Snippet[];
}

export interface ComponentDescription extends ComponentMetadata {
  keywords: string[];
}

export interface RemoteComponentDescription {
  exportName: string;
  url: string;
}
