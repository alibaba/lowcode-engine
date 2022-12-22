import store from 'store';

declare global {
  interface Window {
    __isDebug?: boolean;
    __newFunc?: (funcStr: string) => (...args: any[]) => any;
  }
}

// 根据 url 参数设置 debug 选项
const debugRegRes = /_?debug=(.*?)(&|$)/.exec(location.search);
if (debugRegRes && debugRegRes[1]) {
  // eslint-disable-next-line no-underscore-dangle
  window.__isDebug = true;
  // @ts-ignore
  store.storage.write('debug', debugRegRes[1] === 'true' ? '*' : debugRegRes[1]);
} else {
  // eslint-disable-next-line no-underscore-dangle
  window.__isDebug = false;
  store.remove('debug');
}

// 重要，用于矫正画布执行 new Function 的 window 对象上下文
// eslint-disable-next-line no-underscore-dangle
window.__newFunc = (funContext: string): ((...args: any[]) => any) => {
  // eslint-disable-next-line no-new-func
  return new Function(funContext) as (...args: any[]) => any;
};

// 关闭浏览器前提醒，只有产生过交互才会生效
window.onbeforeunload = function (e: Event): string {
  const ev = e || window.event;
  // 本地调试不生效
  if (location.href.indexOf('localhost') > 0) {
    return '';
  }
  const msg = '您确定要离开此页面吗？';
  ev.cancelBubble = true;
  ev.returnValue = true;
  if (e.stopPropagation) {
    e.stopPropagation();
    e.preventDefault();
  }
  return msg;
};
