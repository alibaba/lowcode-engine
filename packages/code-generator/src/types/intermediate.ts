import {
  IAppConfig,
  IAppMeta,
  IContainerNodeItem,
  IDependency,
  II18nMap,
  INpmPackage,
  IUtilItem,
} from './index';

export interface IParseResult {
  containers: IContainerInfo[];
  globalUtils?: IUtilInfo;
  globalI18n?: II18nMap;
  globalRouter?: IRouterInfo;
  project?: IProjectInfo;
}

export interface IContainerInfo extends IContainerNodeItem, IWithDependency {
  containerType: string;
  moduleName: string;
}

export interface IWithDependency {
  deps?: IDependency[];
}

export interface IUtilInfo extends IWithDependency {
  utils: IUtilItem[];
}

export interface IRouterInfo extends IWithDependency {
  routes: Array<{
    path: string;
    componentName: string;
  }>;
}

export interface IProjectInfo {
  config: IAppConfig;
  meta: IAppMeta;
  css?: string;
  constants?: Record<string, string>;
  i18n?: II18nMap;
  packages: INpmPackage[];
}

/**
 * From meta
 * page title
 * router
 * spmb
 *
 * Utils
 *
 * constants
 *
 * i18n
 *
 * components
 *
 * pages
 *
 * layout
 */
