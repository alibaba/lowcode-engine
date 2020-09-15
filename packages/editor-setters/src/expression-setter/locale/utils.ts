import IntlMessageFormat from 'intl-messageformat';

export const isJSExpression = (obj = '') => {
  if (obj && typeof obj === 'object' && obj.type === 'JSExpression') {
    return true;
  }
  return false;
};

/**
 * 用于构造国际化字符串处理函数
 * @param {*} locale 国际化标识，例如 zh-CN、en-US
 * @param {*} messages 国际化语言包
 */
export const generateI18n = (locale = 'zh-CN', messages = {}) => {
  return function (key, values = {}) {
    if (!messages || !messages[key]) return '';
    const formater = new IntlMessageFormat(messages[key], locale);
    return formater.format(values);
  };
};
