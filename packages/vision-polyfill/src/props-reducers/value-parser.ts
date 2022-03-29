import env from '../env';
import { Node } from '@ali/lowcode-designer';
import { isJSSlot, isI18nData, isJSExpression } from '@ali/lowcode-types';
import { isPlainObject } from '@ali/lowcode-utils';
import i18nUtil from '../i18n-util';
import { editor } from '@ali/lowcode-engine';
import { isVariable } from '../utils';

// FIXME: 表达式使用 mock 值，未来live 模式直接使用原始值
// TODO: designType
export function valueParser(obj: any, node: Node): any {
  return deepValueParser(obj, {
    node,
    path: '',
  });
}

function deepValueParser(obj: any, info: {
  node: Node;
  path?: string;
}): any {
  const {
    path = '',
    node,
  } = info;
  // 如果是 vc 体系 / 低代码组件，才做这个兼容处理
  if (!node.componentMeta.prototype && node.componentMeta.getMetadata().devMode !== 'lowcode') {
    return obj;
  }
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
    return obj.map((item) => deepValueParser(item, { node }));
  }
  if (isPlainObject(obj)) {
    if (isI18nData(obj)) {
      // FIXME! use editor.get
      let locale = env.getLocale();
      if (obj.key && i18nUtil.get(obj.key, locale)) {
        return i18nUtil.get(obj.key, locale, {
          node,
          path,
        });
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
      out[key] = deepValueParser(obj[key], {
        node,
        path: path ? `${path}.${key}` : key,
      });
    });
    return out;
  }
  return obj;
}
