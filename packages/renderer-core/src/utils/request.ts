import 'whatwg-fetch';
import fetchJsonp from 'fetch-jsonp';
import { serializeParams } from '.';

function buildUrl(dataAPI: any, params: any) {
  const paramStr = serializeParams(params);
  if (paramStr) {
    return dataAPI.indexOf('?') > 0 ? `${dataAPI}&${paramStr}` : `${dataAPI}?${paramStr}`;
  }
  return dataAPI;
}

export function get(dataAPI: any, params = {}, headers = {}, otherProps = {}) {
  headers = {
    Accept: 'application/json',
    ...headers,
  };
  dataAPI = buildUrl(dataAPI, params);
  return request(dataAPI, 'GET', null, headers, otherProps);
}

export function post(dataAPI: any, params = {}, headers: any = {}, otherProps = {}) {
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
      : serializeParams(params),
    headers,
    otherProps,
  );
}

export function request(dataAPI: any, method = 'GET', data: any, headers = {}, otherProps: any = {}) {
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

export function jsonp(dataAPI: any, params = {}, otherProps = {}) {
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
