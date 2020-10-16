
import { isI18NObject } from './is-object';

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
