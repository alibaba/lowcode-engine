import { createIntl } from '@alilc/lowcode-editor-core';
import en_US from './en-US.json';
import zh_CN from './zh-CN.json';

const { intl, intlNode, getLocale, setLocale } = createIntl({
  'en-US': en_US,
  'zh-CN': zh_CN,
});

export { intl, intlNode, getLocale, setLocale };
