import 'whatwg-fetch';
import fetchMtop from '@ali/lib-mtop';
import fetchJsonp from 'fetch-jsonp';
import bzbRequest from '@ali/bzb-request';
import Debug from 'debug';
import { serialize, buildUrl, parseUrl } from '@ali/b3-one/lib/url';

const debug = Debug('utils:request');
export function get(dataAPI, params = {}, headers = {}, otherProps = {}) {
  headers = {
    Accept: 'application/json',
    ...headers,
  };
  dataAPI = buildUrl(dataAPI, params);
  return request(dataAPI, 'GET', null, headers, otherProps);
}

export function post(dataAPI, params = {}, headers = {}, otherProps = {}) {
  headers = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    ...headers,
  };
  return request(
    dataAPI,
    'POST',
    headers['Content-Type'].indexOf('application/json') > -1 || Array.isArray(params)
      ? JSON.stringify(params)
      : serialize(params),
    headers,
    otherProps,
  );
}

export function request(dataAPI, method = 'GET', data, headers = {}, otherProps = {}) {
  switch (method) {
    case 'PUT':
    case 'DELETE':
      headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      };
      data = JSON.stringify(data || {});
      break;
  }
  return new Promise((resolve, reject) => {
    if (otherProps.timeout) {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, otherProps.timeout);
    }
    fetch(dataAPI, {
      method,
      credentials: 'include',
      headers,
      body: data,
      ...otherProps,
    })
      .then((response) => {
        switch (response.status) {
          case 200:
          case 201:
          case 202:
            return response.json();
          case 204:
            if (method === 'DELETE') {
              return {
                success: true,
              };
            } else {
              return {
                __success: false,
                code: response.status,
              };
            }
          case 400:
          case 401:
          case 403:
          case 404:
          case 406:
          case 410:
          case 422:
          case 500:
            return response
              .json()
              .then((res) => {
                return {
                  __success: false,
                  code: response.status,
                  data: res,
                };
              })
              .catch(() => {
                return {
                  __success: false,
                  code: response.status,
                };
              });
        }
        return null;
      })
      .then((json) => {
        if (json && json.__success !== false) {
          resolve(json);
        } else {
          delete json.__success;
          reject(json);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function jsonp(dataAPI, params = {}, otherProps = {}) {
  return new Promise((resolve, reject) => {
    otherProps = {
      timeout: 5000,
      ...otherProps,
    };
    fetchJsonp(buildUrl(dataAPI, params), otherProps)
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          resolve(json);
        } else {
          reject();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function mtop(dataAPI, params, otherProps = {}) {
  fetchMtop.config.subDomain = otherProps.subDomain || 'm';
  return fetchMtop.request({
    api: dataAPI,
    v: '1.0',
    data: params,
    ecode: otherProps.ecode || 0,
    type: otherProps.method || 'GET',
    dataType: otherProps.dataType || 'jsonp',
    AntiFlood: true, // 防刷
    timeout: otherProps.timeout || 20000,
  });
}

export function bzb(apiCode, params, otherProps = {}) {
  // 通过url参数设置小二工作台请求环境
  const getUrlEnv = () => {
    try {
      if (window.parent && window.parent.location.host === window.location.host) {
        const urlInfo = parseUrl(window.parent && window.parent.location.href);
        return urlInfo && urlInfo.params && urlInfo.params._env;
      }
      const urlInfo = parseUrl(window.location.href);
      return urlInfo && urlInfo.params && urlInfo.params._env;
    } catch (e) {
      return null;
    }
  };

  otherProps.method = otherProps.method || 'GET';
  otherProps.env = getUrlEnv() || otherProps.env || 'prod';
  return bzbRequest(apiCode, {
    data: params,
    ...otherProps,
  });
}
