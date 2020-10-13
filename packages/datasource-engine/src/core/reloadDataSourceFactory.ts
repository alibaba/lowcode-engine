import {
  DataSourceMap,
  RuntimeDataSource,
  RuntimeDataSourceConfig,
} from '@ali/lowcode-types';

export const reloadDataSourceFactory = (
  dataSource: RuntimeDataSource,
  dataSourceMap: DataSourceMap,
) => async () => {
  const allAsyncLoadings: Array<Promise<any>> = [];

  // TODO: 那么，如果有新的类型过来，这个地方怎么处理???
  // 单独处理 urlParams 类型的
  dataSource.list
    .filter(
      (el: RuntimeDataSourceConfig) =>
        el.type === 'urlParams' &&
        (typeof el.isInit === 'boolean' ? el.isInit : true),
    )
    .forEach((el: RuntimeDataSourceConfig) => {
      dataSourceMap[el.id].load();
    });

  const remainRuntimeDataSourceList = dataSource.list.filter(
    (el: RuntimeDataSourceConfig) => el.type !== 'urlParams',
  );

  // 处理并行
  for (const ds of remainRuntimeDataSourceList) {
    if (!ds.options) {
      continue;
    }
    if (
      // 需要考虑出码直接不传值的情况
      ds.isInit &&
      !ds.isSync
    ) {
      allAsyncLoadings.push(dataSourceMap[ds.id].load());
    }
  }

  // 处理串行
  for (const ds of remainRuntimeDataSourceList) {
    if (!ds.options) {
      continue;
    }

    if (
      // 需要考虑出码直接不传值的情况
      ds.isInit &&
      ds.isSync
    ) {
      // eslint-disable-next-line no-await-in-loop
      await dataSourceMap[ds.id].load();
    }
  }

  await Promise.allSettled(allAsyncLoadings);
};
