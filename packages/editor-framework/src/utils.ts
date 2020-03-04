
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

// 注册快捷键
export function registShortCuts(config, editor) {
  const keyboardFilter = (keymaster.filter = event => {
    let eTarget = event.target || event.srcElement;
    let tagName = eTarget.tagName;
    let isInput = !!(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
    let isContenteditable = !!eTarget.getAttribute('contenteditable');
    if (isInput || isContenteditable) {
      if (event.metaKey === true && [70, 83].includes(event.keyCode)) event.preventDefault(); //禁止触发chrome原生的页面保存或查找
      return false;
    } else {
      return true;
    }
  });

  const ideMessage = appHelper.utils && appHelper.utils.ideMessage;

  //复制
  if (!document.copyListener) {
    document.copyListener = e => {
      if (!keyboardFilter(e) || appHelper.isCopying) return;
      const schema = appHelper.schemaHelper && appHelper.schemaHelper.schemaMap[appHelper.activeKey];
      if (!schema || !isSchema(schema)) return;
      appHelper.isCopying = true;
      const schemaStr = serialize(transformSchemaToPure(schema), {
        unsafe: true
      });
      setClipboardData(schemaStr)
        .then(() => {
          ideMessage && ideMessage('success', '当前内容已复制到剪贴板，请使用快捷键Command+v进行粘贴');
          appHelper.emit('schema.copy', schemaStr, schema);
          appHelper.isCopying = false;
        })
        .catch(errMsg => {
          ideMessage && ideMessage('error', errMsg);
          appHelper.isCopying = false;
        });
    };
    document.addEventListener('copy', document.copyListener);
    if (window.parent.vscode) {
      keymaster('command+c', document.copyListener);
    }
  }

  //粘贴
  if (!document.pasteListener) {
    const doPaste = (e, text) => {
      if (!keyboardFilter(e) || appHelper.isPasting) return;
      const schemaHelper = appHelper.schemaHelper;
      let targetKey = appHelper.activeKey;
      let direction = 'after';
      const topKey = schemaHelper.schema && schemaHelper.schema.__ctx && schemaHelper.schema.__ctx.lunaKey;
      if (!targetKey || topKey === targetKey) {
        const schemaHelper = appHelper.schemaHelper;
        const topKey = schemaHelper.schema && schemaHelper.schema.__ctx && schemaHelper.schema.__ctx.lunaKey;
        if (!topKey) return;
        targetKey = topKey;
        direction = 'in';
      }
      appHelper.isPasting = true;
      const schema = parseObj(text);
      if (!isSchema(schema)) {
        appHelper.emit('illegalSchema.paste', text);
        // ideMessage && ideMessage('error', '当前内容不是模型结构，不能粘贴进来！');
        console.warn('paste schema illegal');
        appHelper.isPasting = false;
        return;
      }
      appHelper.emit('material.add', {
        schema,
        targetKey,
        direction
      });
      appHelper.isPasting = false;
      appHelper.emit('schema.paste', schema);
    };
    document.pasteListener = e => {
      const clipboardData = e.clipboardData || window.clipboardData;
      const text = clipboardData && clipboardData.getData('text');
      doPaste(e, text);
    };
    document.addEventListener('paste', document.pasteListener);
    if (window.parent.vscode) {
      keymaster('command+v', e => {
        const sendIDEMessage = window.parent.sendIDEMessage;
        sendIDEMessage &&
          sendIDEMessage({
            action: 'readClipboard'
          })
            .then(text => {
              doPaste(e, text);
            })
            .catch(err => {
              console.warn(err);
            });
      });
    }
  }

  (config || []).forEach(item => {
    keymaster(item.keyboard, ev => {
      ev.preventDefault();
      item.handler(ev, appHelper, keymaster);
    });
  });
}

// 取消注册快捷
export function unRegistShortCuts(config) {
  (config || []).forEach(item => {
    keymaster.unbind(item.keyboard);
  });
  if (window.parent.vscode) {
    keymaster.unbind('command+c');
    keymaster.unbind('command+v');
  }
  if (document.copyListener) {
    document.removeEventListener('copy', document.copyListener);
    delete document.copyListener;
  }
  if (document.pasteListener) {
    document.removeEventListener('paste', document.pasteListener);
    delete document.pasteListener;
  }
}

// 将函数返回结果转成promise形式，如果函数有返回值则根据返回值的bool类型判断是reject还是resolve，若函数无返回值默认执行resolve
export function transformToPromise(input) {
  if (input instanceof Promise) return input;
  return new Promise((resolve, reject) => {
    if (input || input === undefined) {
      resolve();
    } else {
      reject();
    }
  });
}

export function comboEditorConfig(defaultConfig, customConfig) {

}