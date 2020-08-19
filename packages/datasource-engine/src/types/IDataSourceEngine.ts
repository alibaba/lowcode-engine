import { IRuntimeDataSource } from './IRuntimeDataSource';

export interface IDataSourceEngine {
  /** 数据源, key 是数据源的 ID */
  readonly dataSourceMap: Record<string, IRuntimeDataSource>;

  /** 重新加载所有的数据源 */
  reloadDataSource(): Promise<void>;
}
