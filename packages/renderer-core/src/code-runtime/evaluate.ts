import { type EvalCodeFunction } from './codeRuntime';

export const evaluate: EvalCodeFunction = (code: string, scope: any) => {
  return new Function('scope', `"use strict";return (function(){return (${code})}).bind(scope)();`)(
    scope,
  );
};
