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

// TODO: requestConfig mtop 默认的请求 config 怎么处理？
/**
 * @param dataSource
 * @param context
 */

export default (
  dataSource: InterpretDataSource,
  context: IDataSourceRuntimeContext,
  extraConfig: {
    requestHandlersMap: RequestHandlersMap<{ data: unknown }>;
  } = { requestHandlersMap: {} },
) => {
  const { requestHandlersMap } = extraConfig;

  const runtimeDataSource: RuntimeDataSource = adapt2Runtime(
    dataSource,
    context,
  );

  const dataSourceMap = runtimeDataSource.list.reduce(
    (
      prev: Record<string, IRuntimeDataSource>,
      current: RuntimeDataSourceConfig,
    ) => {
      prev[current.id] = new RuntimeDataSourceItem(
        current,
        // type 协议默认值 fetch
        requestHandlersMap[current.type || 'fetch'],
        context,
      );
      return prev;
    },
    {},
  );

  return {
    dataSourceMap,
    reloadDataSource: reloadDataSourceFactory(runtimeDataSource, dataSourceMap),
  };
};
