/* eslint-disable no-console */
/* eslint-disable no-new-func */
import logger from './logger';
import { IPublicTypeRootSchema, IPublicTypeNodeSchema, IPublicTypeJSSlot } from '@alilc/lowcode-types';
import { isI18nData, isJSExpression } from '@alilc/lowcode-utils';
import { isEmpty } from 'lodash';
import IntlMessageFormat from 'intl-messageformat';
import pkg from '../../package.json';
import * as ReactIs from 'react-is';
import { default as ReactPropTypesSecret } from 'prop-types/lib/ReactPropTypesSecret';
import { default as factoryWithTypeCheckers } from 'prop-types/factoryWithTypeCheckers';

(window as any).sdkVersion = pkg.version;

export { pick, isEqualWith as deepEqual, cloneDeep as clone, isEmpty, throttle, debounce } from 'lodash';

const PropTypes2 = factoryWithTypeCheckers(ReactIs.isElement, true);

const EXPRESSION_TYPE = {
  JSEXPRESSION: 'JSExpression',
  JSFUNCTION: 'JSFunction',
  JSSLOT: 'JSSlot',
  JSBLOCK: 'JSBlock',
  I18N: 'i18n',
};

/**
 * check if schema passed in is a valid schema
 * @name isSchema
 * @returns boolean
 */
export function isSchema(schema: any): schema is IPublicTypeNodeSchema {
  if (isEmpty(schema)) {
    return false;
  }
  // Leaf and Slot should be valid
  if (schema.componentName === 'Leaf' || schema.componentName === 'Slot') {
    return true;
  }
  if (Array.isArray(schema)) {
    return schema.every((item) => isSchema(item));
  }
  // check if props is valid
  const isValidProps = (props: any) => {
    if (!props) {
      return false;
    }
    if (isJSExpression(props)) {
      return true;
    }
    return (typeof schema.props === 'object' && !Array.isArray(props));
  };
  return !!(schema.componentName && isValidProps(schema.props));
}

/**
 * check if schema passed in is a container type, including : Component Block Page
 * @param schema
 * @returns boolean
 */
export function isFileSchema(schema: IPublicTypeNodeSchema): schema is IPublicTypeRootSchema {
  if (!isSchema(schema)) {
    return false;
  }
  return ['Page', 'Block', 'Component'].includes(schema.componentName);
}

/**
 * check if current page is nested within another page with same host
 * @returns boolean
 */
export function inSameDomain() {
  try {
    return window.parent !== window && window.parent.location.host === window.location.host;
  } catch (e) {
    return false;
  }
}

/**
 * get css styled name from schema`s fileName
 * FileName -> lce-file-name
 * @returns string
 */
export function getFileCssName(fileName: string) {
  if (!fileName) {
    return;
  }
  const name = fileName.replace(/([A-Z])/g, '-$1').toLowerCase();
  return (`lce-${name}`)
    .split('-')
    .filter((p) => !!p)
    .join('-');
}

/**
 * check if a object is type of JSSlot
 * @returns string
 */
export function isJSSlot(obj: any): obj is IPublicTypeJSSlot {
  if (!obj) {
    return false;
  }
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }

  // Compatible with the old protocol JSBlock
  return [EXPRESSION_TYPE.JSSLOT, EXPRESSION_TYPE.JSBLOCK].includes(obj.type);
}

/**
 * get value from an object
 * @returns string
 */
export function getValue(obj: any, path: string, defaultValue = {}) {
  // array is not valid type, return default value
  if (Array.isArray(obj)) {
    return defaultValue;
  }

  if (isEmpty(obj) || typeof obj !== 'object') {
    return defaultValue;
  }

  const res = path.split('.').reduce((pre, cur) => {
    return pre && pre[cur];
  }, obj);
  if (res === undefined) {
    return defaultValue;
  }
  return res;
}

/**
 * 用于处理国际化字符串
 * @param {*} key 语料标识
 * @param {*} values 字符串模版变量
 * @param {*} locale 国际化标识，例如 zh-CN、en-US
 * @param {*} messages 国际化语言包
 */
export function getI18n(key: string, values = {}, locale = 'zh-CN', messages: Record<string, any> = {}) {
  if (!messages || !messages[locale] || !messages[locale][key]) {
    return '';
  }
  const formater = new IntlMessageFormat(messages[locale][key], locale);
  return formater.format(values);
}

/**
 * 判断当前组件是否能够设置ref
 * @param {*} Comp 需要判断的组件
 */
export function canAcceptsRef(Comp: any) {
  const hasSymbol = typeof Symbol === 'function' && Symbol.for;
  const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  // eslint-disable-next-line max-len
  return Comp?.$$typeof === REACT_FORWARD_REF_TYPE || Comp?.prototype?.isReactComponent || Comp?.prototype?.setState || Comp._forwardRef;
}

/**
 * transform array to a object
 * @param arr array to be transformed
 * @param key key of array item, which`s value will be used as key in result map
 * @param overwrite overwrite existing item in result or not
 * @returns object result map
 */
export function transformArrayToMap(arr: any[], key: string, overwrite = true) {
  if (isEmpty(arr) || !Array.isArray(arr)) {
    return {};
  }
  const res: any = {};
  arr.forEach((item) => {
    const curKey = item[key];
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

export function checkPropTypes(value: any, name: string, rule: any, componentName: string) {
  let ruleFunction = rule;
  if (typeof rule === 'string') {
    ruleFunction = new Function(`"use strict"; const PropTypes = arguments[0]; return ${rule}`)(PropTypes2);
  }
  if (!ruleFunction || typeof ruleFunction !== 'function') {
    console.warn('checkPropTypes should have a function type rule argument');
    return true;
  }
  const err = ruleFunction(
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

/**
 * transform string to a function
 * @param str function in string form
 * @returns funtion
 */
export function transformStringToFunction(str: string) {
  if (typeof str !== 'string') {
    return str;
  }
  if (inSameDomain() && (window.parent as any).__newFunc) {
    return (window.parent as any).__newFunc(`"use strict"; return ${str}`)();
  } else {
    return new Function(`"use strict"; return ${str}`)();
  }
}

/**
 * 对象类型JSExpression，支持省略this
 * @param str expression in string form
 * @param self scope object
 * @returns funtion
 */

function parseExpression(options: {
  str: any; self: any; thisRequired?: boolean; logScope?: string;
}): any;
function parseExpression(str: any, self: any, thisRequired?: boolean): any;
function parseExpression(a: any, b?: any, c = false) {
  let str;
  let self;
  let thisRequired;
  let logScope;
  if (typeof a === 'object' && b === undefined) {
    str = a.str;
    self = a.self;
    thisRequired = a.thisRequired;
    logScope = a.logScope;
  } else {
    str = a;
    self = b;
    thisRequired = c;
  }
  try {
    const contextArr = ['"use strict";', 'var __self = arguments[0];'];
    contextArr.push('return ');
    let tarStr: string;

    tarStr = (str.value || '').trim();

    // NOTE: use __self replace 'this' in the original function str
    // may be wrong in extreme case which contains '__self' already
    tarStr = tarStr.replace(/this(\W|$)/g, (_a: any, b: any) => `__self${b}`);
    tarStr = contextArr.join('\n') + tarStr;

    // 默认调用顶层窗口的parseObj, 保障new Function的window对象是顶层的window对象
    if (inSameDomain() && (window.parent as any).__newFunc) {
      return (window.parent as any).__newFunc(tarStr)(self);
    }
    const code = `with(${thisRequired ? '{}' : '$scope || {}'}) { ${tarStr} }`;
    return new Function('$scope', code)(self);
  } catch (err) {
    logger.error(`${logScope || ''} parseExpression.error`, err, str, self?.__self ?? self);
    return undefined;
  }
}

export {
  parseExpression,
};

export function parseThisRequiredExpression(str: any, self: any) {
  return parseExpression(str, self, true);
}

/**
 * capitalize first letter
 * @param word string to be proccessed
 * @returns string capitalized string
 */
export function capitalizeFirstLetter(word: string) {
  if (!word || !isString(word) || word.length === 0) {
    return word;
  }
  return word[0].toUpperCase() + word.slice(1);
}

/**
 * check str passed in is a string type of not
 * @param str obj to be checked
 * @returns boolean
 */
export function isString(str: any): boolean {
  return {}.toString.call(str) === '[object String]';
}

/**
 * check if obj is type of variable structure
 * @param obj object to be checked
 * @returns boolean
 */
export function isVariable(obj: any) {
  if (!obj || Array.isArray(obj)) {
    return false;
  }
  return typeof obj === 'object' && obj?.type === 'variable';
}

/**
 * 将 i18n 结构，降级解释为对 i18n 接口的调用
 * @param i18nInfo object
 * @param self context
 */
export function parseI18n(i18nInfo: any, self: any) {
  return parseExpression({
    type: EXPRESSION_TYPE.JSEXPRESSION,
    value: `this.i18n('${i18nInfo.key}')`,
  }, self);
}

/**
 * for each key in targetObj, run fn with the value of the value, and the context paased in.
 * @param targetObj object that keys will be for each
 * @param fn function that process each item
 * @param context
 */
export function forEach(targetObj: any, fn: any, context?: any) {
  if (!targetObj || Array.isArray(targetObj) || isString(targetObj) || typeof targetObj !== 'object') {
    return;
  }

  Object.keys(targetObj).forEach((key) => fn.call(context, targetObj[key], key));
}

interface IParseOptions {
  thisRequiredInJSE?: boolean;
  logScope?: string;
}

export function parseData(schema: unknown, self: any, options: IParseOptions = {}): any {
  if (isJSExpression(schema)) {
    return parseExpression({
      str: schema,
      self,
      thisRequired: options.thisRequiredInJSE,
      logScope: options.logScope,
    });
  } else if (isI18nData(schema)) {
    return parseI18n(schema, self);
  } else if (typeof schema === 'string') {
    return schema.trim();
  } else if (Array.isArray(schema)) {
    return schema.map((item) => parseData(item, self, options));
  } else if (typeof schema === 'function') {
    return schema.bind(self);
  } else if (typeof schema === 'object') {
    // 对于undefined及null直接返回
    if (!schema) {
      return schema;
    }
    const res: any = {};
    forEach(schema, (val: any, key: string) => {
      if (key.startsWith('__')) {
        return;
      }
      res[key] = parseData(val, self, options);
    });
    return res;
  }
  return schema;
}

/**
 * process params for using in a url query
 * @param obj params to be processed
 * @returns string
 */
export function serializeParams(obj: any) {
  let result: any = [];
  forEach(obj, (val: any, key: any) => {
    if (val === null || val === undefined || val === '') {
      return;
    }
    if (typeof val === 'object') {
      result.push(`${key}=${encodeURIComponent(JSON.stringify(val))}`);
    } else {
      result.push(`${key}=${encodeURIComponent(val)}`);
    }
  });
  return result.join('&');
}
