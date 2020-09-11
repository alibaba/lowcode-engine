import { BaseGenerator, IScope } from '../types/core';

export function executeFunctionStack<I, T, C>(
  input: I,
  scope: IScope,
  funcs: BaseGenerator<I, T, C> | Array<BaseGenerator<I, T, C>>,
  baseFunc: BaseGenerator<I, T, C>,
  config?: C,
): T {
  const funcList: Array<BaseGenerator<I, T, C>> = [];
  if (Array.isArray(funcs)) {
    funcList.push(...funcs);
  } else {
    funcList.push(funcs);
  }

  let next: BaseGenerator<I, T, C> = baseFunc;
  while (funcList.length > 0) {
    const func = funcList.pop();
    if (func) {
      const warppedFunc = ((nextFunc) => (input: I, scope: IScope, cfg?: C) => func(input, scope, cfg, nextFunc))(next);
      next = warppedFunc;
    }
  }

  return next(input, scope, config);
}
