
import { isI18NObject } from './is-object';
import get from 'lodash.get';

export function isUseI18NSetter(prototype: any, propName: string) {
  const configure = prototype?.options?.configure;
  if (Array.isArray(configure)) {
    return configure.some(c => {
      return c.name === propName && c?.setter?.type?.displayName === 'I18nSetter';
    });
  }
  return false;
}

export function convertToI18NObject(v: string | object, locale: string = 'zh_CN') {
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
