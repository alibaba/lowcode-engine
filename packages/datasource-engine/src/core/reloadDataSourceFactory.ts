import { DataSourceMap, RuntimeDataSource, RuntimeDataSourceConfig } from '@ali/lowcode-types';
import allSettled from 'promise.allsettled';

// 兼容低版本的浏览器
const promiseSettled = typeof Promise.allSettled === 'function' ? Promise.allSettled.bind(Promise) : allSettled;

export const reloadDataSourceFactory = (
  dataSource: RuntimeDataSource,
  dataSourceMap: DataSourceMap,
  dataHandler?: (dataSourceMap: DataSourceMap) => void,
) => async () => {
  const allAsyncLoadings: Array<Promise<any>> = [];

  // TODO: 那么，如果有新的类型过来，这个地方怎么处理???
  // 单独处理 urlParams 类型的
  dataSource.list
    .filter(
      (el: RuntimeDataSourceConfig) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        el.type === 'urlParams' && (typeof el.isInit === 'boolean' ? el.isInit : true),
    )
    .forEach((el: RuntimeDataSourceConfig) => {
      dataSourceMap[el.id].load();
    });

  const remainRuntimeDataSourceList = dataSource.list.filter((el: RuntimeDataSourceConfig) => el.type !== 'urlParams');

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
      try {
        // eslint-disable-next-line no-await-in-loop
        await dataSourceMap[ds.id].load();
      } catch (e) {
        // TODO: 这个错误直接吃掉？
        console.error(e);
      }
    }
  }

  await promiseSettled(allAsyncLoadings);

  // 所有的初始化请求都结束之后，调用钩子函数

  if (dataHandler) {
    dataHandler(dataSourceMap);
  }
};
