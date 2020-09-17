/* eslint-disable object-curly-newline */
import { transformArrayToMap, isJSFunction, transformStringToFunction, clone } from './index';
import { jsonp, mtop, request, get, post, bzb } from './request';

const DS_STATUS = {
  INIT: 'init',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};
export default class DataHelper {
  constructor(comp, config = {}, appHelper, parser) {
    this.host = comp;
    this.config = config;
    this.parser = parser;
    this.ajaxList = (config && config.list) || [];
    this.ajaxMap = transformArrayToMap(this.ajaxList, 'id');
    this.dataSourceMap = this.generateDataSourceMap();
    this.appHelper = appHelper;
  }

  // 重置config，dataSourceMap状态会被重置；
  resetConfig(config = {}) {
    this.config = config;
    this.ajaxList = (config && config.list) || [];
    this.ajaxMap = transformArrayToMap(this.ajaxList, 'id');
    this.dataSourceMap = this.generateDataSourceMap();
    return this.dataSourceMap;
  }

  // 更新config，只会更新配置，状态保存；
  updateConfig(config = {}) {
    this.config = config;
    this.ajaxList = (config && config.list) || [];
    const ajaxMap = transformArrayToMap(this.ajaxList, 'id');
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
          load: (...args) => {
            return this.getDataSource(item.id, ...args);
          },
        };
      }
    });
    return this.dataSourceMap;
  }

  generateDataSourceMap() {
    const res = {};
    this.ajaxList.forEach((item) => {
      res[item.id] = {
        status: DS_STATUS.INIT,
        load: (...args) => {
          return this.getDataSource(item.id, ...args);
        },
      };
    });
    return res;
  }

  updateDataSourceMap(id, data, error) {
    this.dataSourceMap[id].error = error || undefined;
    this.dataSourceMap[id].data = data;
    this.dataSourceMap[id].status = error ? DS_STATUS.ERROR : DS_STATUS.LOADED;
  }

  getInitData() {
    const initSyncData = this.parser(this.ajaxList).filter((item) => {
      if (item.isInit) {
        this.dataSourceMap[item.id].status = DS_STATUS.LOADING;
        return true;
      }
      return false;
    });
    // 所有 datasource 的 datahandler
    return this.asyncDataHandler(initSyncData).then((res) => {
      let { dataHandler } = this.config;
      if (isJSFunction(dataHandler)) {
        dataHandler = transformStringToFunction(dataHandler.value);
      }
      if (!dataHandler || typeof dataHandler !== 'function') return res;
      try {
        return dataHandler.call(this.host, res);
      } catch (e) {
        console.error('请求数据处理函数运行出错', e);
      }
    });
  }

  getDataSource(id, params, otherOptions, callback) {
    const req = this.parser(this.ajaxMap[id]);
    const options = req.options || {};
    if (typeof otherOptions === 'function') {
      callback = otherOptions;
      otherOptions = {};
    }
    const { headers, ...otherProps } = otherOptions || {};
    if (!req) {
      console.warn(`getDataSource API named ${id} not exist`);
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
      .then((res) => {
        try {
          callback && callback(res && res[id]);
        } catch (e) {
          console.error('load请求回调函数报错', e);
        }

        return res && res[id];
      })
      .catch((err) => {
        try {
          callback && callback(null, err);
        } catch (e) {
          console.error('load请求回调函数报错', e);
        }

        return err;
      });
  }

  asyncDataHandler(asyncDataList) {
    return new Promise((resolve, reject) => {
      const allReq = [];
      const doserReq = [];
      const doserList = [];
      const beforeRequest = this.appHelper && this.appHelper.utils && this.appHelper.utils.beforeRequest;
      const afterRequest = this.appHelper && this.appHelper.utils && this.appHelper.utils.afterRequest;
      const csrfInput = document.getElementById('_csrf_token');
      const _tb_token_ = csrfInput && csrfInput.value;
      asyncDataList.forEach((req) => {
        const { id, type, options } = req;
        if (!id || !type || type === 'legao') return;
        if (type === 'doServer') {
          const { uri, params } = options || {};
          if (!uri) return;
          doserList.push(id);
          doserReq.push({ name: uri, package: 'cms', params });
        } else {
          allReq.push(req);
        }
      });

      if (doserReq.length > 0) {
        allReq.push({
          type: 'doServer',
          options: {
            uri: '/nrsService.do',
            cors: true,
            method: 'POST',
            params: {
              data: JSON.stringify(doserReq),
              _tb_token_,
            },
          },
        });
      }
      if (allReq.length === 0) resolve({});
      const res = {};
      // todo:
      Promise.all(
        allReq.map((item) => {
          return new Promise((resolve) => {
            const { type, id, dataHandler, options } = item;
            const doFetch = (type, options) => {
              this.fetchOne(type, options)
                .then((data) => {
                  if (afterRequest) {
                    this.appHelper.utils.afterRequest(item, data, undefined, (data, error) => {
                      fetchHandler(data, error);
                    });
                  } else {
                    fetchHandler(data, undefined);
                  }
                })
                .catch((err) => {
                  if (afterRequest) {
                    // 必须要这么调用，否则beforeRequest中的this会丢失
                    this.appHelper.utils.afterRequest(item, undefined, err, (data, error) => {
                      fetchHandler(data, error);
                    });
                  } else {
                    fetchHandler(undefined, err);
                  }
                });
            };
            const fetchHandler = (data, error) => {
              if (type === 'doServer') {
                if (!Array.isArray(data)) {
                  data = [data];
                }
                doserList.forEach((id, idx) => {
                  const req = this.ajaxMap[id];
                  if (req) {
                    res[id] = this.dataHandler(id, req.dataHandler, data && data[idx], error);
                    this.updateDataSourceMap(id, res[id], error);
                  }
                });
              } else {
                res[id] = this.dataHandler(id, dataHandler, data, error);
                this.updateDataSourceMap(id, res[id], error);
              }
              resolve();
            };

            if (type === 'doServer') {
              doserList.forEach((item) => {
                this.dataSourceMap[item].status = DS_STATUS.LOADING;
              });
            } else {
              this.dataSourceMap[id].status = DS_STATUS.LOADING;
            }
            // 请求切片
            if (beforeRequest) {
              // 必须要这么调用，否则beforeRequest中的this会丢失
              this.appHelper.utils.beforeRequest(item, clone(options), (options) => doFetch(type, options));
            } else {
              doFetch(type, options);
            }
          });
        }),
      )
        .then(() => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  // dataHandler todo:
  dataHandler(id, dataHandler, data, error) {
    if (isJSFunction(dataHandler)) {
      dataHandler = transformStringToFunction(dataHandler.value);
    }
    if (!dataHandler || typeof dataHandler !== 'function') return data;
    try {
      return dataHandler.call(this.host, data, error);
    } catch (e) {
      console.error(`[${ id }]单个请求数据处理函数运行出错`, e);
    }
  }

  fetchOne(type, options) {
    // eslint-disable-next-line prefer-const
    let { uri, url, method = 'GET', headers, params, ...otherProps } = options;
    otherProps = otherProps || {};
    switch (type) {
      case 'mtop':
        method && (otherProps.method = method);
        return mtop(uri, params, otherProps);
      case 'jsonp':
        return jsonp(uri, params, otherProps);
      case 'bzb':
        return bzb(uri, params, {
          method,
          headers,
          ...otherProps,
        });
      // todo:
      case 'legao':
        if (method === 'JSONP') {
          return jsonp(url, params, otherProps);
        }
        // return webTable(uri, params, otherProps);
        break;
      default:
        method = method.toUpperCase();
        if (method === 'GET') {
          return get(uri, params, headers, otherProps);
        }
        if (method === 'POST') {
          return post(uri, params, headers, otherProps);
        }
        return request(uri, method, params, headers, otherProps);
    }
  }
}
