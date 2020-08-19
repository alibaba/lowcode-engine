import {
  DataSourceConfig,
  DataSourceEngineOptions,
  IDataSourceEngine,
  IDataSourceEngineFactory,
  IRuntimeContext,
} from '../types';
import { RuntimeDataSource } from './RuntimeDataSource';

export class DataSourceEngine implements IDataSourceEngine {
  private _dataSourceMap: Record<string, RuntimeDataSource> = {};

  constructor(
    private _dataSourceConfig: DataSourceConfig,
    private _runtimeContext: IRuntimeContext,
    private _options?: DataSourceEngineOptions,
  ) {
    _dataSourceConfig.list?.forEach((ds) => {
      // 确保数据源都有处理器
      const requestHandler =
        ds.requestHandler || _options?.requestHandlersMap?.[ds.type];
      if (!requestHandler) {
        throw new Error(`No request handler for "${ds.type}" data source`);
      }

      this._dataSourceMap[ds.id] = new RuntimeDataSource(
        ds.id,
        ds.type,
        getValue(ds.options) || {},
        requestHandler.bind(_runtimeContext),
        ds.dataHandler ? ds.dataHandler.bind(_runtimeContext) : undefined,
        (data) => {
          _runtimeContext.setState({ [ds.id]: data });
        },
      );
    });
  }

  public get dataSourceMap() {
    return this._dataSourceMap;
  }

  public async reloadDataSource() {
    try {
      const allDataSourceConfigList = this._dataSourceConfig.list || [];

      // urlParams 类型的优先加载
      for (const ds of allDataSourceConfigList) {
        if (ds.type === 'urlParams' && (getValue(ds.isInit) ?? true)) {
          await this._dataSourceMap[ds.id].load();
        }
      }

      await sleep(0); // TODO: 如何优雅地解决 setState 的异步问题？

      // 然后是所有其他的
      const remainDataSourceConfigList = allDataSourceConfigList.filter(
        (x) => x.type !== 'urlParams',
      );

      // 先发起异步的
      const asyncLoadings: Array<Promise<unknown>> = [];
      for (const ds of remainDataSourceConfigList) {
        if (getValue(ds.isInit) ?? true) {
          const options = getValue(ds.options);
          if (options && !options.isSync) {
            this._dataSourceMap[ds.id].setOptions(options);
            asyncLoadings.push(
              this._dataSourceMap[ds.id].load(options?.params).catch(() => {}),
            );
          }
        }
      }

      try {
        // 再按先后顺序发起同步请求
        for (const ds of remainDataSourceConfigList) {
          if (getValue(ds.isInit) ?? true) {
            const options = getValue(ds.options);
            if (options && options.isSync) {
              this._dataSourceMap[ds.id].setOptions(options);
              await this._dataSourceMap[ds.id].load(options?.params);
              await sleep(0); // TODO: 如何优雅地解决 setState 的异步问题？
            }
          }
        }
      } catch (e) {}

      await Promise.all(asyncLoadings);
    } finally {
      const allDataHandler = this._dataSourceConfig.dataHandler;
      if (allDataHandler) {
        await allDataHandler(this._getDataMapOfAll());
      }
    }
  }

  private _getDataMapOfAll(): Record<string, unknown> {
    const dataMap: Record<string, unknown> = {};

    Object.entries(this._dataSourceMap).forEach(([dsId, ds]) => {
      dataMap[dsId] = ds.data;
    });

    return dataMap;
  }
}

export const create: IDataSourceEngineFactory['create'] = (
  dataSourceConfig,
  runtimeContext,
  options,
) => {
  return new DataSourceEngine(dataSourceConfig, runtimeContext, options);
};

function getValue<T>(valueOrValueGetter: T | (() => T)): T;
function getValue<T extends boolean>(
  valueOrValueGetter: T | (() => T),
): T | undefined {
  if (typeof valueOrValueGetter === 'function') {
    try {
      return valueOrValueGetter();
    } catch (e) {
      return undefined;
    }
  } else {
    return valueOrValueGetter;
  }
}

function sleep(ms: number = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
