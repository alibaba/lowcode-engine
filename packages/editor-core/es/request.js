import _extends from "@babel/runtime/helpers/extends";
import 'whatwg-fetch';
import Debug from 'debug';
var debug = Debug('request');
export function serialize(obj) {
  var rst = [];
  Object.entries(obj || {}).forEach(function (_ref) {
    var key = _ref[0],
        val = _ref[1];
    if (val === null || val === undefined || val === '') return;
    if (typeof val === 'object') rst.push(key + "=" + encodeURIComponent(JSON.stringify(val)));else rst.push(key + "=" + encodeURIComponent(val));
  });
  return rst.join('&');
}
export function buildUrl(dataAPI, params) {
  var paramStr = serialize(params);

  if (paramStr) {
    return dataAPI.indexOf('?') > 0 ? dataAPI + "&" + paramStr : dataAPI + "?" + paramStr;
  }

  return dataAPI;
}
export function get(dataAPI, params, headers, otherProps) {
  var fetchHeaders = _extends({
    Accept: 'application/json'
  }, headers);

  return request(buildUrl(dataAPI, params), 'GET', null, fetchHeaders, otherProps);
}
export function post(dataAPI, params, headers, otherProps) {
  var fetchHeaders = _extends({
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }, headers);

  return request(dataAPI, 'POST', fetchHeaders['Content-Type'].indexOf('application/json') > -1 || Array.isArray(params) ? JSON.stringify(params) : serialize(params), fetchHeaders, otherProps);
}
export function request(dataAPI, method, data, headers, otherProps) {
  if (method === void 0) {
    method = 'GET';
  }

  return new Promise(function (resolve, reject) {
    if (otherProps && otherProps.timeout) {
      setTimeout(function () {
        reject(new Error('timeout'));
      }, otherProps.timeout);
    }

    fetch(dataAPI, _extends({
      method: method,
      credentials: 'include',
      headers: headers,
      body: data
    }, otherProps)).then(function (response) {
      switch (response.status) {
        case 200:
        case 201:
        case 202:
          return response.json();

        case 204:
          if (method === 'DELETE') {
            return {
              success: true
            };
          } else {
            return {
              __success: false,
              code: response.status
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
          return response.json().then(function (res) {
            return {
              __success: false,
              code: response.status,
              data: res
            };
          })["catch"](function () {
            return {
              __success: false,
              code: response.status
            };
          });

        default:
          return null;
      }
    }).then(function (json) {
      if (json && json.__success !== false) {
        resolve(json);
      } else {
        delete json.__success;
        reject(json);
      }
    })["catch"](function (err) {
      debug(err);
      reject(err);
    });
  });
}