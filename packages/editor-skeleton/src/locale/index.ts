import { createIntl } from '@alilc/lowcode-editor-core';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

const { intl, intlNode, getLocale, setLocale } = createIntl({
  'en-US': enUS,
  'zh-CN': zhCN,
});

export { intl, intlNode, getLocale, setLocale };
