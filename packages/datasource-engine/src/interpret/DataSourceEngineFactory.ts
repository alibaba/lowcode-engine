import { adapt2Runtime } from '../core/adapter';
import { RuntimeDataSourceItem } from '../core/RuntimeDataSourceItem';
import { reloadDataSourceFactory } from '../core/reloadDataSourceFactory';
import {
  IDataSourceRuntimeContext,
  InterpretDataSource,
  IRuntimeDataSource,
  RequestHandlersMap,
  RuntimeDataSource,
  RuntimeDataSourceConfig,
} from '@ali/lowcode-types';
import { getRequestHandler } from '../helpers';

/**
 * @param dataSource
 * @param context
 * @param extraConfig: { requestHandlersMap }
 */

export default (
  dataSource: InterpretDataSource,
  context: IDataSourceRuntimeContext,
  extraConfig: {
    requestHandlersMap: RequestHandlersMap<{ data: unknown }>;
  } = { requestHandlersMap: {} },
) => {
  const { requestHandlersMap } = extraConfig;

  const runtimeDataSource: RuntimeDataSource = adapt2Runtime(dataSource, context);

  const dataSourceMap = runtimeDataSource.list.reduce(
    (prev: Record<string, IRuntimeDataSource>, current: RuntimeDataSourceConfig) => {
      prev[current.id] = new RuntimeDataSourceItem(current, getRequestHandler(current, requestHandlersMap), context);
      return prev;
    },
    {},
  );

  return {
    dataSourceMap,
    reloadDataSource: reloadDataSourceFactory(runtimeDataSource, dataSourceMap, runtimeDataSource.dataHandler),
  };
};
