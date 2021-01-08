import { EditingTarget, Node as DocNode, SaveHandler } from '@ali/lowcode-designer';
import Env from './env';
import { isJSExpression, isI18nData } from '@ali/lowcode-types';
import i18nUtil from './i18n-util';

interface I18nObject {
  type?: string;
  use?: string;
  key?: string;
  [lang: string]: string | undefined;
}

function getI18nText(obj: I18nObject) {
  let locale = Env.getLocale();
  if (obj.key) {
    return i18nUtil.get(obj.key, locale);
  }
  if (locale !== 'zh_CN' && locale !== 'zh_TW' && !obj[locale]) {
    locale = 'en_US';
  }
  return obj[obj.use || locale] || obj.zh_CN;
}

function getText(node: DocNode, prop: string) {
  const p = node.getProp(prop, false);
  if (!p || p.isUnset()) {
    return null;
  }
  let v = p.getValue();
  if (isJSExpression(v)) {
    v = v.mock;
  }
  if (v == null) {
    return null;
  }
  if (p.type === 'literal') {
    return v;
  }
  if ((v as any).type === 'i18n') {
    return getI18nText(v as any);
  }
  return Symbol.for('not-literal');
}

export function liveEditingRule(target: EditingTarget) {
  // for vision components specific
  const { node, rootElement, event } = target;

  const targetElement = event.target as HTMLElement;

  if (!Array.from(targetElement.childNodes).every(item => item.nodeType === Node.TEXT_NODE)) {
    return null;
  }

  const { innerText } = targetElement;
  const propTarget = ['title', 'label', 'text', 'content'].find(prop => {
    return equalText(getText(node, prop), innerText);
  });

  if (propTarget) {
    return {
      propElement: targetElement,
      propTarget,
    };
  }
  return null;
}

function equalText(v: any, innerText: string) {
  // TODO: enhance compare text logic
  if (typeof v !== 'string') {
    return false;
  }
  return v.trim() === innerText;
}

export const liveEditingSaveHander: SaveHandler = {
  condition: (prop) => {
    const v = prop.getValue();
    return prop.type === 'expression' || isI18nData(v);
  },
  onSaveContent: (content, prop) => {
    const v = prop.getValue();
    const locale = Env.getLocale();
    let data = v;
    if (isJSExpression(v)) {
      data = v.mock;
    }
    if (isI18nData(data)) {
      const i18n = data.key ? i18nUtil.getItem(data.key) : null;
      if (i18n) {
        i18n.setDoc(content, locale);
        return;
      }
      data = {
        ...(data as any),
        [locale]: content,
      };
    } else {
      data = content;
    }
    if (isJSExpression(v)) {
      prop.setValue({
        type: 'JSExpression',
        value: v.value,
        mock: data,
      });
    } else {
      prop.setValue(data);
    }
  },
};
// TODO:
// 非文本编辑
//  国际化数据，改变当前
//  JSExpression, 改变 mock 或 弹出绑定变量
