import { type ISandbox } from './codeRuntime';

export const defaultSandbox: ISandbox = {
  eval(code, scope) {
    return new Function(
      'scope',
      `"use strict";return (function(){return (${code})}).bind(scope)();`,
    )(scope);
  },
};
