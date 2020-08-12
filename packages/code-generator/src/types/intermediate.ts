import { IAppConfig, IAppMeta, IContainerNodeItem, IDependency, II18nMap, UtilItem } from '.';

export interface IParseResult {
  containers: IContainerInfo[];
  globalUtils?: IUtilInfo;
  globalI18n?: II18nMap;
  globalRouter?: IRouterInfo;
  project?: IProjectInfo;
}

export type IContainerInfo = IContainerNodeItem &
  IWithDependency & {
    containerType: string;
    moduleName: string;
  };

export interface IWithDependency {
  deps?: IDependency[];
}

export interface IUtilInfo extends IWithDependency {
  utils: UtilItem[];
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
  containersDeps?: IDependency[];
  utilsDeps?: IDependency[];
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
