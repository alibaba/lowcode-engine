import IntlMessageFormat from 'intl-messageformat';
import keymaster from 'keymaster';
import _isEmpty from 'lodash/isEmpty';
import { EditorConfig, LocaleType, I18nMessages, I18nFunction, ShortCutsConfig } from './definitions';
import Editor from './editor';

export const isEmpty = _isEmpty;

const ENV = {
  TBE: 'TBE',
  WEBIDE: 'WEB-IDE',
  VSCODE: 'VSCODE',
  WEB: 'WEB'
};

export interface IDEMessageParams {
  action: string;
  data: {
    logKey: string;
    gmKey: string;
    goKey: string;
  };
}

export interface Window {
  sendIDEMessage: (IDEMessageParams) => void;
  goldlog: {
    record: (logKey: string, gmKey: string, goKey: string, method: 'GET' | 'POST') => void;
  };
  parent: Window;
  is_theia: boolean;
  vscode: boolean;
}

/**
 * 用于构造国际化字符串处理函数
 */
export function generateI18n(locale: LocaleType = 'zh-CN', messages: I18nMessages = {}): I18nFunction {
  return (key, values = {}) => {
    if (!messages || !messages[key]) return '';
    const formater = new IntlMessageFormat(messages[key], locale);
    return formater.format(values);
  };
}

/**
 * 序列化参数
 */
export function serializeParams(obj: object): string {
  if (typeof obj !== 'object') return '';
  const res: Array<string> = [];
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
export function goldlog(gmKey: string, params: object = {}, logKey: string = 'other'): void {
  const global = window as Window;
  const sendIDEMessage = global.sendIDEMessage || global.parent.sendIDEMessage;
  const goKey = serializeParams({
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
  global.goldlog && global.goldlog.record(`/iceluna.core.${logKey}`, gmKey, goKey, 'POST');
}

/**
 * 获取当前编辑器环境
 */
export function getEnv(): string {
  const userAgent = navigator.userAgent;
  const isVscode = /Electron\//.test(userAgent);
  if (isVscode) return ENV.VSCODE;
  const isTheia = window.is_theia === true;
  if (isTheia) return ENV.WEBIDE;
  return ENV.WEB;
}

// 注册快捷键
export function registShortCuts(config: ShortCutsConfig, editor: Editor): void {
  (config || []).forEach(item => {
    keymaster(item.keyboard, ev => {
      ev.preventDefault();
      item.handler(editor, ev, keymaster);
    });
  });
}

// 取消注册快捷
export function unRegistShortCuts(config: ShortCutsConfig): void {
  (config || []).forEach(item => {
    keymaster.unbind(item.keyboard);
  });
  if (window.parent.vscode) {
    keymaster.unbind('command+c');
    keymaster.unbind('command+v');
  }
}

/**
 * 将函数返回结果转成promise形式，如果函数有返回值则根据返回值的bool类型判断是reject还是resolve，若函数无返回值默认执行resolve
 */
export function transformToPromise(input: any): Promise<{}> {
  if (input instanceof Promise) return input;
  return new Promise((resolve, reject) => {
    if (input || input === undefined) {
      resolve();
    } else {
      reject();
    }
  });
}

/**
 * 将数组类型转换为Map类型
 */
interface MapOf<T> {
  [propName: string]: T;
}
export function transformArrayToMap<T>(arr: Array<T>, key: string, overwrite: boolean = true): MapOf<T> {
  if (isEmpty(arr) || !Array.isArray(arr)) return {};
  const res = {};
  arr.forEach(item => {
    const curKey = item[key];
    if (item[key] === undefined) return;
    if (res[curKey] && !overwrite) return;
    res[curKey] = item;
  });
  return res;
}

/**
 * 解析url的查询参数
 */
interface Query {
  [propName: string]: string;
}
export function parseSearch(search: string): Query {
  if (!search || typeof search !== 'string') return {};
  const str = search.replace(/^\?/, '');
  let paramStr = str.split('&');
  let res = {};
  for (let i = 0; i < paramStr.length; i++) {
    let regRes = paramStr[i].split('=');
    if (regRes[0] && regRes[1]) {
      res[regRes[0]] = decodeURIComponent(regRes[1]);
    }
  }
  return res;
}

export function comboEditorConfig(defaultConfig: EditorConfig = {}, customConfig: EditorConfig): EditorConfig {
  const { skeleton, theme, plugins, hooks, shortCuts, lifeCycles, constants, utils, i18n } = customConfig || {};

  if (skeleton && skeleton.handler && typeof skeleton.handler === 'function') {
    return skeleton.handler({
      skeleton,
      ...defaultConfig
    });
  }

  const defaultShortCuts = transformArrayToMap(defaultConfig.shortCuts || [], 'keyboard');
  const customShortCuts = transformArrayToMap(shortCuts || [], 'keyboard');
  const localeList = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP'];
  const i18nConfig = {};
  localeList.forEach(key => {
    i18nConfig[key] = {
      ...(defaultConfig.i18n && defaultConfig.i18n[key]),
      ...(i18n && i18n[key])
    };
  });
  return {
    skeleton,
    theme: {
      ...defaultConfig.theme,
      ...theme
    },
    plugins: {
      ...defaultConfig.plugins,
      ...plugins
    },
    hooks: [...(defaultConfig.hooks || []), ...(hooks || [])],
    shortCuts: Object.values({
      ...defaultShortCuts,
      ...customShortCuts
    }),
    lifeCycles: {
      ...defaultConfig.lifeCycles,
      ...lifeCycles
    },
    constants: {
      ...defaultConfig.constants,
      ...constants
    },
    utils: [...(defaultConfig.utils || []), ...(utils || [])],
    i18n: i18nConfig
  };
}
