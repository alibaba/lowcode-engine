import { createIntl } from '@alilc/lowcode-editor-core';
import enUS from './en-US.json';
import zhCN from './zh-CN.json';

const { intl, getLocale } = createIntl?.({
  'en-US': enUS,
  'zh-CN': zhCN,
}) || {
  intl: (id) => {
    return zhCN[id];
  },
};

export { intl, enUS, zhCN, getLocale };
