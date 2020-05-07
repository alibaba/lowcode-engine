import Env from './env';
const I18nUtil = require('@ali/ve-i18n-util');

interface I18nObject {
  type?: string;
  use?: string;
  key?: string;
  [lang: string]: string | undefined;
}

export function i18nReducer(obj?: any): any {
  if (!obj) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => i18nReducer(item));
  }
  if (typeof obj === 'object') {
    if (obj.type === 'i18n') {
      // FIXME! use editor.get
      let locale = Env.getLocale();
      if (obj.key) {
        // FIXME: 此处需要升级I18nUtil，改成响应式
        return I18nUtil.get(obj.key, locale);
      }
      if (locale !== 'zh_CN' && locale !== 'zh_TW' && !obj[locale]) {
        locale = 'en_US';
      }
      return obj[obj.use || locale] || obj.zh_CN;
    }
    const out: I18nObject = {};
    Object.keys(obj).forEach((key) => {
      out[key] = i18nReducer(obj[key]);
    });
    return out;
  }
  return obj;
}
