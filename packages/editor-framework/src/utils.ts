
import IntlMessageFormat from 'intl-messageformat';
import _isEmpty from 'lodash/isEmpty';

export const isEmpty = _isEmpty;

/**
 * 用于构造国际化字符串处理函数
 * @param {*} locale 国际化标识，例如 zh-CN、en-US
 * @param {*} messages 国际化语言包
 */
export function generateI18n(locale = 'zh-CN', messages = {}) {
  return (key, values = {}) => {
    if (!messages || !messages[key]) return '';
    const formater = new IntlMessageFormat(messages[key], locale);
    return formater.format(values);
  };
}

/**
 * 序列化参数
 * @param {*} obj 参数
 */
export function serializeParams(obj:object):string {
  if (typeof obj !== 'object') return '';

  const res:Array<string> = [];
  Object.entries(obj).forEach(([key, val]) => {
    if (val === null || val === undefined || val === '') return;
    if (typeof val === 'object') {
      res.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(val))}`);
    } else {
      res.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    }
  });
  return res.join('&');
}

/**
 * 黄金令箭埋点
 * @param {String} gmKey 为黄金令箭业务类型
 * @param {Object} params 参数
 * @param {String} logKey 属性串
 */
export function goldlog(gmKey, params = {}, logKey = 'other') {
  const sendIDEMessage = window.sendIDEMessage || window.parent.sendIDEMessage;
  const goKey = serializeParams({
    sdkVersion: pkg.version,
    env: getEnv(),
    ...params
  });
  if (sendIDEMessage) {
    sendIDEMessage({
      action: 'goldlog',
      data: {
        logKey: `/iceluna.core.${logKey}`,
        gmKey,
        goKey
      }
    });
  }
  window.goldlog && window.goldlog.record(`/iceluna.core.${logKey}`, gmKey, goKey, 'POST');
}

/**
 * 获取当前编辑器环境
 */
export function getEnv() {
  const userAgent = navigator.userAgent;
  const isVscode = /Electron\//.test(userAgent);
  if (isVscode) return ENV.VSCODE;
  const isTheia = window.is_theia === true;
  if (isTheia) return ENV.WEBIDE;
  return ENV.WEB;
}