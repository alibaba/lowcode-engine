import { EditingTarget, Node as DocNode } from '@ali/lowcode-designer';
import Env from './env';
import { isJSExpression } from '@ali/lowcode-types';
const I18nUtil = require('@ali/ve-i18n-util');

interface I18nObject {
  type?: string;
  use?: string;
  key?: string;
  [lang: string]: string | undefined;
}

function getI18nText(obj: I18nObject) {
  let locale = Env.getLocale();
  if (obj.key) {
    return I18nUtil.get(obj.key, locale);
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
  const v = p.getValue();
  if (v == null) {
    return null;
  }
  if (p.type === 'literal') {
    return v;
  }
  if ((v as any).type === 'i18n') {
    return getI18nText(v as any);
  }
  if (isJSExpression(v)) {
    return v.mock;
  }
}

export function liveEditingRule(target: EditingTarget) {
  // for vision components specific
  const { node, rootElement, event } = target;

  const targetElement = event.target as HTMLElement;

  if (!Array.from(targetElement.childNodes).every(item => item.nodeType === Node.TEXT_NODE)) {
    return null;
  }

  const innerText = targetElement.innerText;
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
  return v.trim() === innerText
}

// TODO:
export function liveEditingSaveHander() {

}
