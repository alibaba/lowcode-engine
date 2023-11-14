/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { isJSFunction } from '@alilc/lowcode-utils';
import { transformArrayToMap, transformStringToFunction } from './common';
import { jsonp, request, get, post } from './request';
import logger from './logger';
import { DataSource, DataSourceItem, IRendererAppHelper } from '../types';

const DS_STATUS = {
  INIT: 'init',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

type DataSourceType = 'fetch' | 'jsonp';

/**
 * do request for standard DataSourceType
 * @param {DataSourceType} type type of DataSourceItem
 * @param {any} options
 */
export function doRequest(type: DataSourceType, options: any) {
  // eslint-disable-next-line prefer-const
  let { uri, url, method = 'GET', headers, params, ...otherProps } = options;
  otherProps = otherProps || {};
  if (type === 'jsonp') {
    return jsonp(uri, params, otherProps);
  }

  if (type === 'fetch') {
    switch (method.toUpperCase()) {
      case 'GET':
        return get(uri, params, headers, otherProps);
      case 'POST':
        return post(uri, params, headers, otherProps);
      default:
        return request(uri, method, params, headers, otherProps);
    }
  }

  logger.log(`Engine default dataSource does not support type:[${type}] dataSource request!`, options);
}

// TODO: according to protocol, we should implement errorHandler/shouldFetch/willFetch/requestHandler and isSync controll.
export class DataHelper {
  /**
   * host object that will be "this" object when excuting dataHandler
   *
   * @type {*}
   * @memberof DataHelper
   */
  host: any;

  /**
   * data source config
   *
   * @type {DataSource}
   * @memberof DataHelper
   */
  config: DataSource;

  /**
   * a parser function which will be called to process config data
   * which eventually will call common/utils.processData() to process data
   * (originalConfig) => parsedConfig
   * @type {*}
   * @memberof DataHelper
   */
  parser: any;

  /**
   * config.list
   *
   * @type {any[]}
   * @memberof DataHelper
   */
  ajaxList: any[];

  ajaxMap: any;

  dataSourceMap: any;

  appHelper: IRendererAppHelper;

  constructor(comp: any, config: DataSource, appHelper: IRendererAppHelper, parser: any) {
    this.host = comp;
    this.config = config || {};
    this.parser = parser;
    this.ajaxList = config?.list || [];
    this.ajaxMap = transformArrayToMap(this.ajaxList, 'id');
    this.dataSourceMap = this.generateDataSourceMap();
    this.appHelper = appHelper;
  }

  // 更新config，只会更新配置，状态保存；
  updateConfig(config = {}) {
    this.config = config as DataSource;
    this.ajaxList = (config as DataSource)?.list || [];
    const ajaxMap: any = transformArrayToMap(this.ajaxList, 'id');
    // 删除已经移除的接口
    Object.keys(this.ajaxMap).forEach((key) => {
      if (!ajaxMap[key]) {
        delete this.dataSourceMap[key];
      }
    });
    this.ajaxMap = ajaxMap;
    // 添加未加入到dataSourceMap中的接口
    this.ajaxList.forEach((item) => {
      if (!this.dataSourceMap[item.id]) {
        this.dataSourceMap[item.id] = {
          status: DS_STATUS.INIT,
          load: (...args: any) => {
            // @ts-ignore
            return this.getDataSource(item.id, ...args);
          },
        };
      }
    });
    return this.dataSourceMap;
  }

  generateDataSourceMap() {
    const res: any = {};
    this.ajaxList.forEach((item) => {
      res[item.id] = {
        status: DS_STATUS.INIT,
        load: (...args: any) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return this.getDataSource(item.id, ...args);
        },
      };
    });
    return res;
  }

  updateDataSourceMap(id: string, data: any, error: any) {
    this.dataSourceMap[id].error = error || undefined;
    this.dataSourceMap[id].data = data;
    this.dataSourceMap[id].status = error ? DS_STATUS.ERROR : DS_STATUS.LOADED;
  }

  /**
   * get all dataSourceItems which marked as isInit === true
   * @private
   * @returns
   * @memberof DataHelper
   */
  getInitDataSourseConfigs() {
    const initConfigs = this.parser(this.ajaxList).filter((item: DataSourceItem) => {
      // according to [spec](https://lowcode-engine.cn/lowcode), isInit should be boolean true to be working
      if (item.isInit === true) {
        this.dataSourceMap[item.id].status = DS_STATUS.LOADING;
        return true;
      }
      return false;
    });
    return initConfigs;
  }

  /**
   * process all dataSourceItems which marked as isInit === true, and get dataSource request results.
   * @public
   * @returns
   * @memberof DataHelper
   */
  getInitData() {
    const initSyncData = this.getInitDataSourseConfigs();
    // 所有 datasource 的 datahandler
    return this.asyncDataHandler(initSyncData).then((res) => {
      const { dataHandler } = this.config;
      return this.handleData(null, dataHandler, res, null);
    });
  }

  getDataSource(id: string, params: any, otherOptions: any, callback: any) {
    const req = this.parser(this.ajaxMap[id]);
    const options = req.options || {};
    let callbackFn = callback;
    let otherOptionsObj = otherOptions;
    if (typeof otherOptions === 'function') {
      callbackFn = otherOptions;
      otherOptionsObj = {};
    }
    const { headers, ...otherProps } = otherOptionsObj || {};
    if (!req) {
      logger.warn(`getDataSource API named ${id} not exist`);
      return;
    }

    return this.asyncDataHandler([
      {
        ...req,
        options: {
          ...options,
          // 支持参数为array的情况，当参数为array时，不做参数合并
          params:
            Array.isArray(options.params) || Array.isArray(params)
              ? params || options.params
              : {
                ...options.params,
                ...params,
              },
          headers: {
            ...options.headers,
            ...headers,
          },
          ...otherProps,
        },
      },
    ])
    .then((res: any) => {
      try {
        callbackFn && callbackFn(res && res[id]);
      } catch (e) {
        logger.error('load请求回调函数报错', e);
      }
      return res && res[id];
    })
    .catch((err) => {
      try {
        callbackFn && callbackFn(null, err);
      } catch (e) {
        logger.error('load请求回调函数报错', e);
      }
      return err;
    });
  }

  asyncDataHandler(asyncDataList: any[]) {
    return new Promise((resolve, reject) => {
      const allReq: any[] = [];
      asyncDataList.forEach((req) => {
        const { id, type } = req;
        // TODO: need refactoring to remove 'legao' related logic
        if (!id || !type || type === 'legao') {
          return;
        }
        allReq.push(req);
      });

      if (allReq.length === 0) {
        resolve({});
      }
      const res: any = {};
      Promise.all(
        allReq.map((item: any) => {
          return new Promise((innerResolve) => {
            const { type, id, dataHandler, options } = item;

            const fetchHandler = (data: any, error: any) => {
              res[id] = this.handleData(id, dataHandler, data, error);
              this.updateDataSourceMap(id, res[id], error);
              innerResolve({});
            };

            const doFetch = (innerType: string, innerOptions: any) => {
              doRequest(innerType as any, innerOptions)
                ?.then((data: any) => {
                  fetchHandler(data, undefined);
                })
                .catch((err: Error) => {
                  fetchHandler(undefined, err);
                });
            };

            this.dataSourceMap[id].status = DS_STATUS.LOADING;
            doFetch(type, options);
          });
        }),
      ).then(() => {
        resolve(res);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  /**
   * process data using dataHandler
   *
   * @param {(string | null)} id request id, will be used in error message, can be null
   * @param {*} dataHandler
   * @param {*} data
   * @param {*} error
   * @returns
   * @memberof DataHelper
   */
  handleData(id: string | null, dataHandler: any, data: any, error: any) {
    let dataHandlerFun = dataHandler;
    if (isJSFunction(dataHandler)) {
      dataHandlerFun = transformStringToFunction(dataHandler.value);
    }
    if (!dataHandlerFun || typeof dataHandlerFun !== 'function') {
      return data;
    }
    try {
      return dataHandlerFun.call(this.host, data, error);
    } catch (e) {
      if (id) {
        logger.error(`[${id}]单个请求数据处理函数运行出错`, e);
      } else {
        logger.error('请求数据处理函数运行出错', e);
      }
    }
  }
}
