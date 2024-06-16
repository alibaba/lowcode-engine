export function evaluate(code: string, scope: any) {
  return new Function('scope', `"use strict";return (function(){return (${code})}).bind(scope)();`)(
    scope,
  );
}
