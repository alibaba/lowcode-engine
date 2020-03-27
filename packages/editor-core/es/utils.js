import _extends from "@babel/runtime/helpers/extends";
import IntlMessageFormat from 'intl-messageformat';
import keymaster from 'keymaster';
import _clone from 'lodash/cloneDeep';
import _debounce from 'lodash/debounce';
import _isEmpty from 'lodash/isEmpty';
import _deepEqual from 'lodash/isEqualWith';
import _pick from 'lodash/pick';
import _throttle from 'lodash/throttle';
import _serialize from 'serialize-javascript';
export { get, post, request } from './request';
export var pick = _pick;
export var deepEqual = _deepEqual;
export var clone = _clone;
export var isEmpty = _isEmpty;
export var throttle = _throttle;
export var debounce = _debounce;
export var serialize = _serialize;
var ENV = {
  TBE: 'TBE',
  WEBIDE: 'WEB-IDE',
  VSCODE: 'VSCODE',
  WEB: 'WEB'
};

/*
 * 用于构造国际化字符串处理函数
 */
export function generateI18n(locale, messages) {
  if (locale === void 0) {
    locale = 'zh-CN';
  }

  if (messages === void 0) {
    messages = {};
  }

  return function (key, values) {
    if (!messages || !messages[key]) {
      return '';
    }

    var formater = new IntlMessageFormat(messages[key], locale);
    return formater.format(values);
  };
}
/**
 * 序列化参数
 */

export function serializeParams(obj) {
  if (typeof obj !== 'object') {
    return '';
  }

  var res = [];
  Object.entries(obj).forEach(function (_ref) {
    var key = _ref[0],
        val = _ref[1];

    if (val === null || val === undefined || val === '') {
      return;
    }

    if (typeof val === 'object') {
      res.push(encodeURIComponent(key) + "=" + encodeURIComponent(JSON.stringify(val)));
    } else {
      res.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
    }
  });
  return res.join('&');
}
/**
 * 黄金令箭埋点
 * @param {String} gmKey 为黄金令箭业务类型
 * @param {Object} params 参数
 * @param {String} logKey 属性串
 */

export function goldlog(gmKey, params, logKey) {
  if (params === void 0) {
    params = {};
  }

  if (logKey === void 0) {
    logKey = 'other';
  }

  var sendIDEMessage = window.sendIDEMessage || window.parent.sendIDEMessage;
  var goKey = serializeParams(_extends({
    env: getEnv()
  }, params));

  if (sendIDEMessage) {
    sendIDEMessage({
      action: 'goldlog',
      data: {
        logKey: "/iceluna.core." + logKey,
        gmKey: gmKey,
        goKey: goKey
      }
    });
  }

  if (window.goldlog) {
    window.goldlog.record("/iceluna.core." + logKey, gmKey, goKey, 'POST');
  }
}
/**
 * 获取当前编辑器环境
 */

export function getEnv() {
  var userAgent = navigator.userAgent;
  var isVscode = /Electron\//.test(userAgent);

  if (isVscode) {
    return ENV.VSCODE;
  }

  var isTheia = window.is_theia === true;

  if (isTheia) {
    return ENV.WEBIDE;
  }

  return ENV.WEB;
} // 注册快捷键

export function registShortCuts(config, editor) {
  (config || []).forEach(function (item) {
    keymaster(item.keyboard, function (ev) {
      ev.preventDefault();
      item.handler(editor, ev, keymaster);
    });
  });
} // 取消注册快捷

export function unRegistShortCuts(config) {
  (config || []).forEach(function (item) {
    keymaster.unbind(item.keyboard);
  });

  if (window.parent.vscode) {
    keymaster.unbind('command+c');
    keymaster.unbind('command+v');
  }
}
/**
 * 将函数返回结果转成promise形式，如果函数有返回值则根据返回值的bool类型判断是reject还是resolve，若函数无返回值默认执行resolve
 */

export function transformToPromise(input) {
  if (input instanceof Promise) {
    return input;
  }

  return new Promise(function (resolve, reject) {
    if (input || input === undefined) {
      resolve();
    } else {
      reject();
    }
  });
}
/**
 * 将数组类型转换为Map类型
 */

export function transformArrayToMap(arr, key, overwrite) {
  if (overwrite === void 0) {
    overwrite = true;
  }

  if (isEmpty(arr) || !Array.isArray(arr)) {
    return {};
  }

  var res = {};
  arr.forEach(function (item) {
    var curKey = item[key];

    if (item[key] === undefined) {
      return;
    }

    if (res[curKey] && !overwrite) {
      return;
    }

    res[curKey] = item;
  });
  return res;
}
/**
 * 解析url的查询参数
 */

export function parseSearch(search) {
  if (!search || typeof search !== 'string') {
    return {};
  }

  var str = search.replace(/^\?/, '');
  var paramStr = str.split('&');
  var res = {};
  paramStr.forEach(function (item) {
    var regRes = item.split('=');

    if (regRes[0] && regRes[1]) {
      res[regRes[0]] = decodeURIComponent(regRes[1]);
    }
  });
  return res;
}
export function comboEditorConfig(defaultConfig, customConfig) {
  if (defaultConfig === void 0) {
    defaultConfig = {};
  }

  var _ref2 = customConfig || {},
      skeleton = _ref2.skeleton,
      theme = _ref2.theme,
      plugins = _ref2.plugins,
      hooks = _ref2.hooks,
      shortCuts = _ref2.shortCuts,
      lifeCycles = _ref2.lifeCycles,
      constants = _ref2.constants,
      utils = _ref2.utils,
      i18n = _ref2.i18n;

  if (skeleton && skeleton.handler && typeof skeleton.handler === 'function') {
    return skeleton.handler(_extends({
      skeleton: skeleton
    }, defaultConfig));
  }

  var defaultShortCuts = transformArrayToMap(defaultConfig.shortCuts || [], 'keyboard');
  var customShortCuts = transformArrayToMap(shortCuts || [], 'keyboard');
  var localeList = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP'];
  var i18nConfig = {};
  localeList.forEach(function (key) {
    i18nConfig[key] = _extends({}, defaultConfig.i18n && defaultConfig.i18n[key], {}, i18n && i18n[key]);
  });
  return {
    skeleton: skeleton,
    theme: _extends({}, defaultConfig.theme, {}, theme),
    plugins: _extends({}, defaultConfig.plugins, {}, plugins),
    hooks: [].concat(defaultConfig.hooks || [], hooks || []),
    shortCuts: Object.values(_extends({}, defaultShortCuts, {}, customShortCuts)),
    lifeCycles: _extends({}, defaultConfig.lifeCycles, {}, lifeCycles),
    constants: _extends({}, defaultConfig.constants, {}, constants),
    utils: [].concat(defaultConfig.utils || [], utils || []),
    i18n: i18nConfig
  };
}
/**
 * 判断当前组件是否能够设置ref
 * @param {*} Comp 需要判断的组件
 */

export function acceptsRef(Comp) {
  var hasSymbol = typeof Symbol === 'function' && Symbol["for"];
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol["for"]('react.forward_ref') : 0xead0;

  if (!Comp || typeof Comp !== 'object' || isEmpty(Comp)) {
    return false;
  }

  return Comp.$$typeof && Comp.$$typeof === REACT_FORWARD_REF_TYPE || Comp.prototype && Comp.prototype.isReactComponent;
}