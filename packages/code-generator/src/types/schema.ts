import { BlockSchema, ComponentSchema, NodeSchema, PageSchema, ProjectSchema } from '@ali/lowcode-types';

export * from '@ali/lowcode-types';

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
export interface IBasicSchema extends ProjectSchema {}

export interface IProjectSchema extends IBasicSchema {
  // TODO: 下面的几个值真的需要吗？....
  constants: Record<string, string>; // 应用范围内的全局常量；
  css: string; // 应用范围内的全局样式；
  config: IAppConfig; // 当前应用配置信息
  meta: IAppMeta; // 当前应用元数据信息
}

/**
 * 搭建基础协议 - 单个容器节点描述
 *
 * @export
 * @interface IContainerNodeItem
 * @extends {NodeSchema}
 */
export type IContainerNodeItem = PageSchema | BlockSchema | ComponentSchema;

// TODO...
export interface IBasicMeta {
  title: string; // 标题描述
}

// TODO...
export interface IPageMeta extends IBasicMeta {
  router: string; // 页面路由
  spmb?: string; // spm
}

export interface IAppConfig {
  sdkVersion?: string; // 渲染模块版本
  historyMode?: 'browser' | 'hash'; // 浏览器路由：browser  哈希路由：hash
  targetRootID?: string; // 渲染根节点 ID
  layout?: NodeSchema;
  theme?: object; // 主题配置，根据接入的主题模块不同
  miniAppBuildType?: 'runtime' | 'compile'; // 小程序的构建类型
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
