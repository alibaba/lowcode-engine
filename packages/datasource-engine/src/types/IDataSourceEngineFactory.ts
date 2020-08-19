import { DataSourceConfig } from './DataSourceConfig';
import { DataSourceEngineOptions } from './DataSourceEngineOptions';
import { IDataSourceEngine } from './IDataSourceEngine';
import { IRuntimeContext } from './IRuntimeContext';

export interface IDataSourceEngineFactory {
  create(
    dataSourceConfig: DataSourceConfig,
    runtimeContext: IRuntimeContext,
    options?: DataSourceEngineOptions,
  ): IDataSourceEngine;
}
