/* eslint-disable no-nested-ternary */
import {
  IRuntimeContext,
  IRuntimeDataSource,
  RuntimeDataSourceConfig,
  RuntimeDataSource,
  RequestHandlersMap,
} from '@ali/build-success-types';

import { RuntimeDataSourceItem } from '../core';
import { reloadDataSourceFactory } from '../core/reloadDataSourceFactory';
import {
  defaultDataHandler,
  defaultShouldFetch,
  defaultWillFetch,
} from '../helpers';

// TODO: requestConfig mtop 默认的请求 config 怎么处理？
/**
 * @param dataSource
 * @param context
 */
export default (
  dataSource: RuntimeDataSource,
  context: IRuntimeContext,
  extraConfig: {
    requestHandlersMap: RequestHandlersMap<{ data: unknown }>;
  } = {
    requestHandlersMap: {},
  },
) => {
  const { requestHandlersMap } = extraConfig;

  // TODO: 对于出码类型，需要做一层数据兼容，给一些必要的值设置默认值,先兜底几个必要的
  dataSource.list.forEach((ds) => {
    ds.isInit = ds.isInit || true;
    ds.isSync = ds.isSync || false;
    ds.shouldFetch = !ds.shouldFetch
      ? defaultShouldFetch
      : typeof ds.shouldFetch === 'function'
        ? ds.shouldFetch.bind(context)
        : ds.shouldFetch;
    ds.willFetch = ds.willFetch ? ds.willFetch.bind(context) : defaultWillFetch;
    ds.dataHandler = ds.dataHandler
      ? ds.dataHandler.bind(context)
      : defaultDataHandler;
  });

  const dataSourceMap = dataSource.list.reduce(
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
    reloadDataSource: reloadDataSourceFactory(dataSource, dataSourceMap),
  };
};
