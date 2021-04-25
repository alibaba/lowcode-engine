
import { isI18NObject } from './is-object';
import get from 'lodash.get';
import { ComponentMeta } from '@ali/lowcode-designer';
interface Variable {
  type: 'variable';
  variable: string;
  value: any;
}

export function isVariable(obj: any): obj is Variable {
  return obj && obj.type === 'variable';
}

export function isUseI18NSetter(prototype: any, propName: string) {
  const configure = prototype?.options?.configure;
  if (Array.isArray(configure)) {
    return configure.some(c => {
      return c.name === propName && c?.setter?.type?.displayName === 'I18nSetter';
    });
  }
  return false;
}

export function convertToI18NObject(v: string | any, locale: string = 'zh_CN') {
  if (isI18NObject(v)) return v;
  return { type: 'i18n', use: locale, [locale]: v };
}

export function isString(v: any): v is string {
  return typeof v === 'string';
}

function _innerWaitForThing(obj: any, path: string): Promise<any> {
  const timeGap = 200;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const thing = get(obj, path);
      if (thing) {
        return resolve(thing);
      }
      reject();
    }, timeGap);
  }).catch(() => {
    return _innerWaitForThing(obj, path);
  });
}

export function waitForThing(obj: any, path: string): Promise<any> {
  const thing = get(obj, path);
  if (thing) {
    return Promise.resolve(thing);
  }
  return _innerWaitForThing(obj, path);
}

/**
 * 判断当前 meta 是否从 vc prototype 转换而来
 * @param meta
 */
export function isFromVC(meta: ComponentMeta) {
  return !!meta?.getMetadata()?.experimental;
}

export function arrShallowEquals(arr1: any[], arr2: any[]): boolean {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  return arr1.every(item => arr2.includes(item));
}

export function executePendingFn(fn: () => void, timeout: number = 2000) {
  return setTimeout(fn, timeout);
}