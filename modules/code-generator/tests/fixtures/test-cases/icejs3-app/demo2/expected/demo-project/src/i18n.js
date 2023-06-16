const i18nConfig = {
  'zh-CN': {
    'i18n-jwg27yo4': '你好',
    'i18n-jwg27yo3': '中国',
  },
  'en-US': {
    'i18n-jwg27yo4': 'Hello',
    'i18n-jwg27yo3': 'China',
  },
};

let locale =
  typeof navigator === 'object' && typeof navigator.language === 'string'
    ? navigator.language
    : 'zh-CN';

const getLocale = () => locale;

const setLocale = (target) => {
  locale = target;
};

const isEmptyVariables = (variables) =>
  (Array.isArray(variables) && variables.length === 0) ||
  (typeof variables === 'object' &&
    (!variables || Object.keys(variables).length === 0));

// 按低代码规范里面的要求进行变量替换
const format = (msg, variables) =>
  typeof msg === 'string'
    ? msg.replace(/\$?\{(\w+)\}/g, (match, key) => variables?.[key] ?? '')
    : msg;

const i18nFormat = ({ id, defaultMessage, fallback }, variables) => {
  const msg =
    i18nConfig[locale]?.[id] ??
    i18nConfig[locale.replace('-', '_')]?.[id] ??
    defaultMessage;
  if (msg == null) {
    console.warn('[i18n]: unknown message id: %o (locale=%o)', id, locale);
    return fallback === undefined ? `${id}` : fallback;
  }

  return format(msg, variables);
};

const i18n = (id, params) => {
  return i18nFormat({ id }, params);
};

// 将国际化的一些方法注入到目标对象&上下文中
const _inject2 = (target) => {
  target.i18n = i18n;
  target.getLocale = getLocale;
  target.setLocale = (locale) => {
    setLocale(locale);
    target.forceUpdate();
  };
  target._i18nText = (t) => {
    // 优先取直接传过来的语料
    const localMsg = t[locale] ?? t[String(locale).replace('-', '_')];
    if (localMsg != null) {
      return format(localMsg, t.params);
    }

    // 其次用项目级别的
    const projectMsg = i18nFormat({ id: t.key, fallback: null }, t.params);
    if (projectMsg != null) {
      return projectMsg;
    }

    // 兜底用 use 指定的或默认语言的
    return format(t[t.use || 'zh-CN'] ?? t.en_US, t.params);
  };

  // 注入到上下文中去
  if (target._context && target._context !== target) {
    Object.assign(target._context, {
      i18n,
      getLocale,
      setLocale: target.setLocale,
    });
  }
};

export { getLocale, setLocale, i18n, i18nFormat, _inject2 };
