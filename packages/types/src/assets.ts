import { Snippet, ComponentMetadata } from './metadata';
import { I18nData } from './i18n';

export interface AssetItem {
  type: AssetType;
  content?: string | null;
  device?: string;
  level?: AssetLevel;
  id?: string;
}

export enum AssetLevel {
  // 环境依赖库 比如 react, react-dom
  Environment = 1,
  // 基础类库，比如 lodash deep fusion antd
  Library = 2,
  // 主题
  Theme = 3,
  // 运行时
  Runtime = 4,
  // 业务组件
  Components = 5,
  // 应用 & 页面
  App = 6,
}

export const AssetLevels = [
  AssetLevel.Environment,
  AssetLevel.Library,
  AssetLevel.Theme,
  AssetLevel.Runtime,
  AssetLevel.Components,
  AssetLevel.App,
];

export type URL = string;

export enum AssetType {
  JSUrl = 'jsUrl',
  CSSUrl = 'cssUrl',
  CSSText = 'cssText',
  JSText = 'jsText',
  Bundle = 'bundle',
}

export interface AssetBundle {
  type: AssetType.Bundle;
  level?: AssetLevel;
  assets?: Asset | AssetList | null;
}

export type Asset = AssetList | AssetBundle | AssetItem | URL;

export type AssetList = Array<Asset | undefined | null>;

/**
 * 资产包协议
 */
export interface AssetsJson {
  /**
   * 资产包协议版本号
   */
  version: string;
  /**
   * 大包列表，external与package的概念相似，融合在一起
   */
  packages?: Package[];
  /**
   * 所有组件的描述协议列表所有组件的列表
   */
  components: Array<ComponentDescription | RemoteComponentDescription>;
  /**
   * 组件分类列表，用来描述物料面板
   * @deprecated 最新版物料面板已不需要此描述
   */
  componentList?: ComponentCategory[];
  /**
   * 业务组件分类列表，用来描述物料面板
   * @deprecated 最新版物料面板已不需要此描述
   */
  bizComponentList?: ComponentCategory[];
  /**
   * 用于描述组件面板中的 tab 和 category
   */
  sort?: ComponentSort;
}

/**
 * 用于描述组件面板中的 tab 和 category
 */
export interface ComponentSort {
  /**
   * 用于描述组件面板的 tab 项及其排序，例如：["精选组件", "原子组件"]
   */
  groupList?: string[];
  /**
   * 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列；
   */
  categoryList?: string[];
}

/**
 * 定义组件大包及 external 资源的信息
 * 应该被编辑器默认加载
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
   * @experimental
   *
   * @todo 需推进提案 @度城
   */
  async?: boolean;
  /**
   * 组件描述导出名字，可以通过 window[exportName] 获取到组件描述的 Object 内容；
   */
  exportName?: string;
}

/**
 * 组件分类
 * @deprecated 已被 ComponentMetadata 替代
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
 * @deprecated 已被 ComponentMetadata 替代
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
   * @todo 待补充文档 @jinchan
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
