import Debug from 'debug';
import _keymaster from 'keymaster';
export const keymaster = _keymaster;
import { forEach as _forEach, shallowEqual as _shallowEqual } from '@ali/b3-one/lib/obj';
import { serialize as serializeParams } from '@ali/b3-one/lib/url';
export const forEach = _forEach;
export const shallowEqual = _shallowEqual;
//moment对象配置
import _moment from 'moment';
import 'moment/locale/zh-cn';
export const moment = _moment;
moment.locale('zh-cn');
import pkg from '../../package.json';
window.sdkVersion = pkg.version;

import _pick from 'lodash/pick';
import _deepEqual from 'lodash/isEqualWith';
import _clone from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import _throttle from 'lodash/throttle';
import _debounce from 'lodash/debounce';

export const pick = _pick;
export const deepEqual = _deepEqual;
export const clone = _clone;
export const isEmpty = _isEmpty;
export const throttle = _throttle;
export const debounce = _debounce;

import _serialize from 'serialize-javascript';
export const serialize = _serialize;
import * as _jsonuri from 'jsonuri';
export const jsonuri = _jsonuri;
export { get, post, jsonp, mtop, request } from './request';

import IntlMessageFormat from 'intl-messageformat';

const ReactIs = require('react-is');
const ReactPropTypesSecret = require('prop-types/lib/ReactPropTypesSecret');
const factoryWithTypeCheckers = require('prop-types/factoryWithTypeCheckers');
const PropTypes2 = factoryWithTypeCheckers(ReactIs.isElement, true);

const EXPRESSION_TYPE = {
  JSEXPRESSION: 'JSExpression',
  JSFUNCTION: 'JSFunction',
  JSSLOT: 'JSSlot',
};
const EXPRESSION_REG = /^\{\{(\{.*\}|.*?)\}\}$/;
const hasSymbol = typeof Symbol === 'function' && Symbol['for'];
const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol['for']('react.forward_ref') : 0xead0;
const debug = Debug('utils:index');

const ENV = {
  TBE: 'TBE',
  WEBIDE: 'WEB-IDE',
  VSCODE: 'VSCODE',
  WEB: 'WEB',
};

/**
 * @name isSchema
 * @description 判断是否是模型结构
 */
export function isSchema(schema, ignoreArr) {
  if (isEmpty(schema)) return false;
  if (!ignoreArr && Array.isArray(schema)) return schema.every((item) => isSchema(item));
  return !!(schema.componentName && schema.props && (typeof schema.props === 'object' || isJSExpression(schema.props)));
}

export function isFileSchema(schema) {
  if (isEmpty(schema)) return false;
  return ['Page', 'Block', 'Component', 'Addon', 'Temp', 'Div'].includes(schema.componentName);
}

// 判断当前页面是否被嵌入到同域的页面中
export function inSameDomain() {
  try {
    return window.parent !== window && window.parent.location.host === window.location.host;
  } catch (e) {
    return false;
  }
}

export function getFileCssName(fileName) {
  if (!fileName) return;
  let name = fileName.replace(/([A-Z])/g, '-$1').toLowerCase();
  return ('luna-' + name)
    .split('-')
    .filter((p) => !!p)
    .join('-');
}

export function isJSSlot(obj) {
  return obj && typeof obj === 'object' && EXPRESSION_TYPE.JSSLOT === obj.type;
}
export function isJSFunction(obj) {
  return obj && typeof obj === 'object' && EXPRESSION_TYPE.JSFUNCTION === obj.type;
}
export function isJSExpression(obj) {
  //兼容两种写法，有js构造表达式的情况
  const isJSExpressionObj =
    obj && typeof obj === 'object' && EXPRESSION_TYPE.JSEXPRESSION === obj.type && typeof obj.value === 'string';
  const isJSExpressionStr = typeof obj === 'string' && EXPRESSION_REG.test(obj.trim());
  return isJSExpressionObj || isJSExpressionStr;
}

/**
 * @name wait
 * @description 等待函数
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms));
}

export function curry(Comp, hocs = []) {
  return hocs.reverse().reduce((pre, cur) => {
    return cur(pre);
  }, Comp);
}

export function getValue(obj, path, defaultValue) {
  if (isEmpty(obj) || typeof obj !== 'object') return defaultValue;
  const res = path.split('.').reduce((pre, cur) => {
    return pre && pre[cur];
  }, obj);
  if (res === undefined) return defaultValue;
  return res;
}

export function parseObj(schemaStr) {
  if (typeof schemaStr !== 'string') return schemaStr;
  //默认调用顶层窗口的parseObj,保障new Function的window对象是顶层的window对象
  try {
    if (inSameDomain() && window.parent.__newFunc) {
      return window.parent.__newFunc(`"use strict"; return ${schemaStr}`)();
    }
    return new Function(`"use strict"; return ${schemaStr}`)();
  } catch (err) {
    return undefined;
  }
}

export function fastClone(obj) {
  return parseObj(serialize(obj, { unsafe: true }));
}

// 更新obj的内容但不改变obj的指针
export function fillObj(receiver = {}, ...suppliers) {
  Object.keys(receiver).forEach((item) => {
    delete receiver[item];
  });
  Object.assign(receiver, ...suppliers);
  return receiver;
}

// 中划线转驼峰
export function toHump(name) {
  return name.replace(/\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}
// 驼峰转中划线
export function toLine(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// 获取当前环境
export function getEnv() {
  const userAgent = navigator.userAgent;
  const isVscode = /Electron\//.test(userAgent);
  if (isVscode) return ENV.VSCODE;
  const isTheia = window.is_theia === true;
  if (isTheia) return ENV.WEBIDE;
  return ENV.WEB;
}

/**
 * 用于构造国际化字符串处理函数
 * @param {*} locale 国际化标识，例如 zh-CN、en-US
 * @param {*} messages 国际化语言包
 */
export function generateI18n(locale = 'zh-CN', messages = {}) {
  return (key, values = {}) => {
    if (!messages || !messages[key]) return '';
    const formater = new IntlMessageFormat(messages[key], locale);
    return formater.format(values);
  };
}

/**
 * 判断当前组件是否能够设置ref
 * @param {*} Comp 需要判断的组件
 */
export function acceptsRef(Comp) {
  return (
    (Comp.$$typeof && Comp.$$typeof === REACT_FORWARD_REF_TYPE) || (Comp.prototype && Comp.prototype.isReactComponent)
  );
}

/**
 * 黄金令箭埋点
 * @param {String} gmKey 为黄金令箭业务类型
 * @param {Object} params 参数
 * @param {String} logKey 属性串
 */
export function goldlog(gmKey, params = {}, logKey = 'other') {
  // vscode 黄金令箭API
  const sendIDEMessage = window.sendIDEMessage || (inSameDomain() && window.parent.sendIDEMessage);
  const goKey = serializeParams({
    sdkVersion: pkg.version,
    env: getEnv(),
    ...params,
  });
  if (sendIDEMessage) {
    sendIDEMessage({
      action: 'goldlog',
      data: {
        logKey: `/iceluna.core.${logKey}`,
        gmKey,
        goKey,
      },
    });
  }
  window.goldlog && window.goldlog.record(`/iceluna.core.${logKey}`, gmKey, goKey, 'POST');
}

// utils为编辑器打包生成的utils文件内容，utilsConfig为数据库存放的utils配置
export function generateUtils(utils, utilsConfig) {
  if (!Array.isArray(utilsConfig)) return { ...utils };
  const res = {};
  utilsConfig.forEach((item) => {
    if (!item.name || !item.type || !item.content) return;
    if (item.type === 'function' && typeof item.content === 'function') {
      res[item.name] = item.content;
    } else if (item.type === 'npm' && utils[item.name]) {
      res[item.name] = utils[item.name];
    }
  });
  return res;
}
// 复制到粘贴板
export function setClipboardData(str) {
  return new Promise((resolve, reject) => {
    if (typeof str !== 'string') reject('不支持拷贝');
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(str)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject('复制失败，请重试！', err);
        });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = str;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        let successful = document.execCommand('copy');
        if (successful) {
          document.body.removeChild(textArea);
          resolve();
        }
      } catch (err) {
        document.body.removeChild(textArea);
        reject('复制失败，请重试！', err);
      }
    }
  });
}
// 获取粘贴板数据
export function getClipboardData() {
  return new Promise((resolve, reject) => {
    if (window.clipboardData) {
      resolve(window.clipboardData.getData('text'));
    } else if (navigator.clipboard) {
      return navigator.clipboard
        .readText()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject('粘贴板获取失败', err);
        });
    } else {
      reject('粘贴板获取失败');
    }
  });
}
// 将函数返回结果转成promise形式，如果函数有返回值则根据返回值的bool类型判断是reject还是resolve，若函数无返回值默认执行resolve
export function transformToPromise(input) {
  if (input instanceof Promise) return input;
  return new Promise((resolve, reject) => {
    if (input || input === undefined) {
      resolve();
    } else {
      reject();
    }
  });
}

export function moveArrayItem(arr, sourceIdx, distIdx, direction) {
  if (
    !Array.isArray(arr) ||
    sourceIdx === distIdx ||
    sourceIdx < 0 ||
    sourceIdx >= arr.length ||
    distIdx < 0 ||
    distIdx >= arr.length
  )
    return arr;
  const item = arr[sourceIdx];
  if (direction === 'after') {
    arr.splice(distIdx + 1, 0, item);
  } else {
    arr.splice(distIdx, 0, item);
  }
  if (sourceIdx < distIdx) {
    arr.splice(sourceIdx, 1);
  } else {
    arr.splice(sourceIdx + 1, 1);
  }
  return arr;
}

export function transformArrayToMap(arr, key, overwrite = true) {
  if (isEmpty(arr) || !Array.isArray(arr)) return {};
  const res = {};
  arr.forEach((item) => {
    const curKey = item[key];
    if (item[key] === undefined) return;
    if (res[curKey] && !overwrite) return;
    res[curKey] = item;
  });
  return res;
}

export function checkPropTypes(value, name, rule, componentName) {
  if (typeof rule === 'string') {
    rule = new Function(`"use strict"; const PropTypes = arguments[0]; return ${rule}`)(PropTypes2);
  }
  if (!rule || typeof rule !== 'function') {
    console.warn('checkPropTypes should have a function type rule argument');
    return true;
  }
  const err = rule(
    {
      [name]: value,
    },
    name,
    componentName,
    'prop',
    null,
    ReactPropTypesSecret,
  );
  if (err) {
    console.warn(err);
  }
  return !err;
}

export function transformSchemaToPure(obj) {
  const pureObj = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => pureObj(item));
    } else if (typeof obj === 'object') {
      // 对于undefined及null直接返回
      if (!obj) return obj;
      const res = {};
      forEach(obj, (val, key) => {
        if (key.startsWith('__') && key !== '__ignoreParse') return;
        res[key] = pureObj(val);
      });
      return res;
    }
    return obj;
  };
  return pureObj(obj);
}

export function transformSchemaToStandard(obj) {
  const standardObj = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => standardObj(item));
    } else if (typeof obj === 'object') {
      // 对于undefined及null直接返回
      if (!obj) return obj;
      const res = {};
      forEach(obj, (val, key) => {
        if (key.startsWith('__') && key !== '__ignoreParse') return;
        if (isSchema(val) && key !== 'children' && obj.type !== 'JSSlot') {
          res[key] = {
            type: 'JSSlot',
            value: standardObj(val),
          };
          // table特殊处理
          if (key === 'cell') {
            res[key].params = ['value', 'index', 'record'];
          }
        } else {
          res[key] = standardObj(val);
        }
      });
      return res;
    } else if (typeof obj === 'function') {
      return {
        type: 'JSFunction',
        value: obj.toString(),
      };
    } else if (typeof obj === 'string' && EXPRESSION_REG.test(obj.trim())) {
      const regRes = obj.trim().match(EXPRESSION_REG);
      return {
        type: 'JSExpression',
        value: (regRes && regRes[1]) || '',
      };
    }
    return obj;
  };
  return standardObj(obj, false);
}

export function transformStringToFunction(str) {
  if (typeof str !== 'string') return str;
  if (inSameDomain() && window.parent.__newFunc) {
    return window.parent.__newFunc(`"use strict"; return ${str}`)();
  } else {
    return new Function(`"use strict"; return ${str}`)();
  }
}

export function addCssTag(id, content) {
  let styleTag = document.getElementById(id);
  if (styleTag) {
    styleTag.innerHTML = content;
    return;
  }
  styleTag = document.createElement('style');
  styleTag.id = id;
  styleTag.class = 'luna-style';
  styleTag.innerHTML = content;
  document.head.appendChild(styleTag);
}

// 注册快捷
export function registShortCuts(config, appHelper) {
  const keyboardFilter = (keymaster.filter = (event) => {
    let eTarget = event.target || event.srcElement;
    let tagName = eTarget.tagName;
    let isInput = !!(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
    let isContenteditable = !!eTarget.getAttribute('contenteditable');
    if (isInput || isContenteditable) {
      if (event.metaKey === true && [70, 83].includes(event.keyCode)) event.preventDefault(); //禁止触发chrome原生的页面保存或查找
      return false;
    } else {
      return true;
    }
  });

  const ideMessage = appHelper.utils && appHelper.utils.ideMessage;

  //复制
  if (!document.copyListener) {
    document.copyListener = (e) => {
      if (!keyboardFilter(e) || appHelper.isCopying) return;
      const schema = appHelper.schemaHelper && appHelper.schemaHelper.schemaMap[appHelper.activeKey];
      if (!schema || !isSchema(schema)) return;
      appHelper.isCopying = true;
      const schemaStr = serialize(transformSchemaToPure(schema), {
        unsafe: true,
      });
      setClipboardData(schemaStr)
        .then(() => {
          ideMessage && ideMessage('success', '当前内容已复制到剪贴板，请使用快捷键Command+v进行粘贴');
          appHelper.emit('schema.copy', schemaStr, schema);
          appHelper.isCopying = false;
        })
        .catch((errMsg) => {
          ideMessage && ideMessage('error', errMsg);
          appHelper.isCopying = false;
        });
    };
    document.addEventListener('copy', document.copyListener);
    if (window.parent.vscode) {
      keymaster('command+c', document.copyListener);
    }
  }

  //粘贴
  if (!document.pasteListener) {
    const doPaste = (e, text) => {
      if (!keyboardFilter(e) || appHelper.isPasting) return;
      const schemaHelper = appHelper.schemaHelper;
      let targetKey = appHelper.activeKey;
      let direction = 'after';
      const topKey = schemaHelper.schema && schemaHelper.schema.__ctx && schemaHelper.schema.__ctx.lunaKey;
      if (!targetKey || topKey === targetKey) {
        const schemaHelper = appHelper.schemaHelper;
        const topKey = schemaHelper.schema && schemaHelper.schema.__ctx && schemaHelper.schema.__ctx.lunaKey;
        if (!topKey) return;
        targetKey = topKey;
        direction = 'in';
      }
      appHelper.isPasting = true;
      const schema = parseObj(text);
      if (!isSchema(schema)) {
        appHelper.emit('illegalSchema.paste', text);
        // ideMessage && ideMessage('error', '当前内容不是模型结构，不能粘贴进来！');
        console.warn('paste schema illegal');
        appHelper.isPasting = false;
        return;
      }
      appHelper.emit('material.add', {
        schema,
        targetKey,
        direction,
      });
      appHelper.isPasting = false;
      appHelper.emit('schema.paste', schema);
    };
    document.pasteListener = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      const text = clipboardData && clipboardData.getData('text');
      doPaste(e, text);
    };
    document.addEventListener('paste', document.pasteListener);
    if (window.parent.vscode) {
      keymaster('command+v', (e) => {
        const sendIDEMessage = window.parent.sendIDEMessage;
        sendIDEMessage &&
          sendIDEMessage({
            action: 'readClipboard',
          })
            .then((text) => {
              doPaste(e, text);
            })
            .catch((err) => {
              console.warn(err);
            });
      });
    }
  }

  (config || []).forEach((item) => {
    keymaster(item.keyboard, (ev) => {
      ev.preventDefault();
      item.handler(ev, appHelper, keymaster);
    });
  });
}

// 取消注册快捷
export function unRegistShortCuts(config) {
  (config || []).forEach((item) => {
    keymaster.unbind(item.keyboard);
  });
  if (window.parent.vscode) {
    keymaster.unbind('command+c');
    keymaster.unbind('command+v');
  }
  if (document.copyListener) {
    document.removeEventListener('copy', document.copyListener);
    delete document.copyListener;
  }
  if (document.pasteListener) {
    document.removeEventListener('paste', document.pasteListener);
    delete document.pasteListener;
  }
}

export function parseData(schema, self) {
  if (isJSExpression(schema)) {
    return parseExpression(schema, self);
  } else if (typeof schema === 'string') {
    return schema.trim();
  } else if (Array.isArray(schema)) {
    return schema.map((item) => parseData(item, self));
  } else if (typeof schema === 'function') {
    return schema.bind(self);
  } else if (typeof schema === 'object') {
    // 对于undefined及null直接返回
    if (!schema) return schema;
    const res = {};
    forEach(schema, (val, key) => {
      if (key.startsWith('__')) return;
      res[key] = parseData(val, self);
    });
    return res;
  }
  return schema;
}

/*全匹配{{开头,}}结尾的变量表达式，或者对象类型JSExpression，且均不支持省略this */
export function parseExpression(str, self) {
  try {
    const contextArr = ['"use strict";', 'var __self = arguments[0];'];
    contextArr.push('return ');
    let tarStr;
    //向前兼容，支持标准协议新格式
    if (typeof str === 'string') {
      const regRes = str.trim().match(EXPRESSION_REG);
      tarStr = regRes[1];
    } else {
      tarStr = (str.value || '').trim();
    }
    tarStr = tarStr.replace(/this(\W|$)/g, (a, b) => `__self${b}`);
    tarStr = contextArr.join('\n') + tarStr;
    //默认调用顶层窗口的parseObj,保障new Function的window对象是顶层的window对象
    if (inSameDomain() && window.parent.__newFunc) {
      return window.parent.__newFunc(tarStr)(self);
    }
    return new Function(tarStr)(self);
  } catch (err) {
    debug('parseExpression.error', err, str, self);
    return undefined;
  }
}
