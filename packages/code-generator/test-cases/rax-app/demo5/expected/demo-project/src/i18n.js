const i18nConfig = {
  'zh-CN': {
    'hello-world': '你好，世界！',
  },
  'en-US': {
    'hello-world': 'Hello world!',
  },
};

let locale = 'en-US';

const getLocale = () => locale;

const setLocale = (target) => {
  locale = target;
};

const i18n = (key) => (i18nConfig && i18nConfig[locale] && i18nConfig[locale][key]) || '';

export { getLocale, setLocale, i18n };
