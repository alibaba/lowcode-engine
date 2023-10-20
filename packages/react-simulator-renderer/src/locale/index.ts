import { createElement } from 'react';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

const instance: Record<string, Record<string, string>> = {
  'zh-CN': zhCN as Record<string, string>,
  'en-US': enUS as Record<string, string>,
};

export function createIntl(locale: string = 'zh-CN') {
  const intl = (id: string) => {
    return instance[locale]?.[id] || id;
  };

  const intlNode = (id: string) => createElement('span', instance[locale]?.[id] || id);

  return {
    intl,
    intlNode,
  };
}
