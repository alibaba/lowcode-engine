function getWrappedFunction(func: any, sourceCode: any) {
    const result = function (...args) {
      try {
        return func.apply(this, args);
      } catch (e) {
        const message = `项目代码执行出错（非引擎内部错误）！非生产环境可以通过在 URL 上加入 ?debug_all 来打开调试模式。更多请点击这里：https://ur.alipay.com/2JbYP
  --------------------------------------------------------
  错误信息：${e.message}
  ${sourceCode ? `以下是原始函数：
  --------------------------------------------------------
  ${sourceCode}
  --------------------------------------------------------` : ''}
  点击下方函数的可以进入并调试方法：
  --------------------------------------------------------
  `;
        console.error(message, func);
      }
    };
    return result;
  }
  
  const USE_STRICT = /^(["'])use strict\1;?/i;
  
  /**
   * parse a function string into Function object, isolateWindow (if any) will be used
   * as the window object instead of global window
   *
   * @param {String} func function string need parse
   * @param {Object} isolateWindow the isolateWindow used when running the action
   */
  export default function (func: any, isolateWindow: any, ctx: any) {
    let sourceCode = func;
  
    // 兼容 ES6 方案，即 funcString 为对象的情况
    // if (typeof func === 'object' && func !== null) {
    //   if (func.id) {
    //     let action;
    //     if (window.VisualEngineUtils) {
    //       action = window.VisualEngineUtils.ActionUtil.getAction(func.id, { func: true });
    //     } else if (window.LeGao && window.LeGao.getContext) {
    //       const _ctx = ctx || window.LeGao.getContext();
    //       action = _ctx.getAction().actionsMap[func.id];
    //     }
  
    //     if (!action) {
    //       const result = () => {
    //         console.error(`无法找到 ${func.id} 函数`);
    //       };
    //       return result;
    //     }
    //     return getWrappedFunction(action.func);
    //   }
    //   sourceCode = func.source;
    //   func = func.compiled || func.source || '';
    // }
  
    if (!func) {
      const result = () => {
        window.location.search.indexOf('dev') >= 0 && console.log('解析的函数为空');
      };
      return result;
    }
  
    if (typeof func === 'function') {
      // TODO: un-annotate these code after vision-render-service done
      // if (isolateWindow) {
      //   return func(isolateWindow);
      // }
      return func;
    }
  
    let code = '';
    if (func.indexOf('var __preParser__') >= 0 && func.indexOf('function') !== 0) {
      code = `
        ${func}
        if (typeof __preParser__ === 'function') {
          return __preParser__.apply(this, Array.prototype.slice.call(arguments));
        }
        console.warn('code must be a string of function');
      `;
    } else {
      code = `
        var __preParser__ = ${func.replace(USE_STRICT, '')};
        if (typeof __preParser__ === 'function') {
          return __preParser__.apply(this, Array.prototype.slice.call(arguments));
        }
        console.warn('code must be a string of function');
      `;
    }
  
    try {
      if (isolateWindow) {
        code = `
          return function() {
            ${code}
          }
        `;
        func = new Function('window', code)(isolateWindow);
      } else {
        func = new Function(code);
      }
    } catch (e) {
      console.error(
        '解析 function 字符串失败，请检查字符串的合法性',
        e.message,
        `\n${sourceCode}`,
      );
      func = function () {
        console.error('代码配置有误，请检查相关配置');
      };
    }
  
    return getWrappedFunction(func, sourceCode);
}
