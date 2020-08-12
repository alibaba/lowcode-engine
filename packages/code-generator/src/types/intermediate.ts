import { I18nMap, UtilsMap, ContainerSchema, JSONObject } from '@ali/lowcode-types';

import { IDependency, INpmPackage } from './deps';

export interface IParseResult {
  containers: IContainerInfo[];
  globalUtils?: IUtilInfo;
  globalI18n?: I18nMap;
  globalRouter?: IRouterInfo;
  project?: IProjectInfo;
}

export interface IWithDependency {
  deps?: IDependency[];
}

export interface IContainerInfo extends ContainerSchema, IWithDependency {
  containerType: string;
  moduleName: string;
}

export interface IUtilInfo extends IWithDependency {
  utils: UtilsMap;
}

export interface IRouterInfo extends IWithDependency {
  routes: Array<{
    path: string;
    componentName: string;
  }>;
}

export interface IProjectInfo {
  css?: string;
  constants?: JSONObject;
  i18n?: I18nMap;
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
