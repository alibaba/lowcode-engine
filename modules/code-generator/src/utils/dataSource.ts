import changeCase from 'change-case';
import type { IProjectInfo } from '../types/intermediate';

export interface DataSourceDependenciesConfig {

  /** 数据源引擎的版本 */
  engineVersion?: string;

  /** 数据源引擎的包名 */
  enginePackage?: string;

  /** 数据源 handlers 的版本 */
  handlersVersion?: {
    [key: string]: string;
  };

  /** 数据源 handlers 的包名 */
  handlersPackages?: {
    [key: string]: string;
  };
}

export function buildDataSourceDependencies(
  ir: IProjectInfo,
  cfg: DataSourceDependenciesConfig = {},
): Record<string, string> {
  return {
    // 数据源引擎的依赖包
    [cfg.enginePackage || '@alilc/lowcode-datasource-engine']: cfg.engineVersion || '^1.0.0',

    // 各种数据源的 handlers 的依赖包
    ...(ir.dataSourcesTypes || []).reduce(
      (acc, dsType) => ({
        ...acc,
        [getDataSourceHandlerPackageName(dsType)]: cfg.handlersVersion?.[dsType] || '^1.0.0',
      }),
      {},
    ),
  };

  function getDataSourceHandlerPackageName(dsType: string) {
    return (
      cfg.handlersPackages?.[dsType] ||
      `@alilc/lowcode-datasource-${changeCase.kebab(dsType)}-handler`
    );
  }
}
