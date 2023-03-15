import {
  IPublicTypeI18nMap,
  IPublicTypeUtilsMap,
  IPublicTypeContainerSchema,
  IPublicTypeJSONObject,
} from '@alilc/lowcode-types';

import { IDependency, INpmPackage } from './deps';
import { ICompAnalyzeResult } from './analyze';

export interface IParseResult {
  containers: IContainerInfo[];
  globalUtils?: IUtilInfo;
  globalI18n?: IPublicTypeI18nMap;
  globalRouter?: IRouterInfo;
  project?: IProjectInfo;
}

export interface IWithDependency {
  deps?: IDependency[];
}

export interface IContainerInfo extends IPublicTypeContainerSchema, IWithDependency {
  containerType: string;
  moduleName: string;
  analyzeResult?: ICompAnalyzeResult;
}

export interface IUtilInfo extends IWithDependency {
  utils: IPublicTypeUtilsMap;
}

export interface IRouterInfo extends IWithDependency {
  routes: Array<{
    path: string;
    fileName: string;
    componentName: string;
  }>;
}

/**
 * project's remarks
 */
export interface ProjectRemark {

  /** if current project only contain one container which type is `Component` */
  isSingleComponent?: boolean;
}

export interface IProjectInfo {
  css?: string;
  containersDeps?: IDependency[];
  utilsDeps?: IDependency[];
  constants?: IPublicTypeJSONObject;
  i18n?: IPublicTypeI18nMap;
  packages: INpmPackage[];
  meta?: { name?: string; title?: string } | Record<string, any>;
  config?: Record<string, any>;
  dataSourcesTypes?: string[];
  projectRemark?: ProjectRemark;
}

export interface IPageMeta {
  router?: string;
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
