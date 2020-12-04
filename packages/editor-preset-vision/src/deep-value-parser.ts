import Env from './env';
import { isJSSlot, isI18nData, isJSExpression } from '@ali/lowcode-types';
import { isPlainObject } from '@ali/lowcode-utils';
import i18nUtil from './i18n-util';
import { editor } from './editor';
import { isVariable } from './utils';

// FIXME: 表达式使用 mock 值，未来live 模式直接使用原始值
// TODO: designType
export function deepValueParser(obj?: any): any {
  if (isJSExpression(obj)) {
    if (editor.get('designMode') === 'live') {
      return obj;
    }
    obj = obj.mock;
  }
  // 兼容 ListSetter 中的变量结构
  if (isVariable(obj)) {
    if (editor.get('designMode') === 'live') {
      return {
        type: 'JSExpression',
        value: obj.variable,
        mock: obj.value,
      };
    }
    obj = obj.value;
  }
  if (!obj) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepValueParser(item));
  }
  if (isPlainObject(obj)) {
    if (isI18nData(obj)) {
      // FIXME! use editor.get
      let locale = Env.getLocale();
      if (obj.key) {
        // FIXME: 此处需要升级I18nUtil，改成响应式
        return i18nUtil.get(obj.key, locale);
      }
      if (locale !== 'zh_CN' && locale !== 'zh_TW' && !obj[locale]) {
        locale = 'en_US';
      }
      return obj[obj.use || locale] || obj.zh_CN;
    }

    if (isJSSlot(obj)) {
      return obj;
    }
    const out: any = {};
    Object.keys(obj).forEach((key) => {
      out[key] = deepValueParser(obj[key]);
    });
    return out;
  }
  return obj;
}
