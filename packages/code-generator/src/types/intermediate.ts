import {
  IAppConfig,
  IAppMeta,
  IContainerNodeItem,
  IDependency,
  II18nMap,
  IInternalDependency,
  IUtilItem,
} from './index';

export interface IPackageJSON {
  name: string;
  description: string;
  version: string;
  main?: string;
  author?: string;
  license?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
}

export interface IParseResult {
  containers: IContainerInfo[];
  globalUtils?: IUtilInfo;
  globalI18n?: II18nMap;
  globalRouter?: IRouterInfo;
  project?: IProjectInfo;
}

export interface IContainerInfo extends IContainerNodeItem, IWithDependency {
  componentName: string;
  containerType: string;
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
