import { IPublicTypeTransformedComponentMetadata } from '@alilc/lowcode-types';
import { isPlainObject, isJSFunction, getLogger } from '@alilc/lowcode-utils';

const leadingFnRe = /^function/;
const leadingFnNameRe = /^\w+\s*\(/;
const logger = getLogger({ level: 'warn', bizName: 'skeleton:transducers' });

/**
 * 将函数字符串转成函数，支持几种类型
 *   类型一：() => {} / val => {}
 *   类型二：setValue() {}
 *   类型三：function() {} / function setValue() {}
 * @param str
 * @returns
 */
function transformStringToFunction(str: string) {
  if (typeof str !== 'string') return str;

  let fn;
  if (leadingFnNameRe.test(str) && !leadingFnRe.test(str)) {
    str = `function ${str}`;
  }
  let fnBody = `
    return function() {
      const self = this;
      try {
        return (${str}).apply(self, arguments);
      } catch(e) {
        console.warn('call function which parsed by lowcode failed: ', e);
        return e.message;
      }
    };
  `;
  try {
    // eslint-disable-next-line no-new-func
    fn = new Function(fnBody)();
  } catch (e) {
    logger.error(str);
    logger.error(e.message);
  }
  return fn;
}

function parseJSFunc(obj: any, enableAllowedKeys = true) {
  if (!obj) return;
  Object.keys(obj).forEach(key => {
    const item = obj[key];
    if (isJSFunction(item)) {
      obj[key] = transformStringToFunction(item.value);
    } else if (Array.isArray(item)) {
      item.forEach(o => parseJSFunc(o, enableAllowedKeys));
    } else if (isPlainObject(item)) {
      parseJSFunc(item, enableAllowedKeys);
    }
  });
}

export default function (metadata: IPublicTypeTransformedComponentMetadata): IPublicTypeTransformedComponentMetadata {
  parseJSFunc(metadata, false);

  return metadata;
}