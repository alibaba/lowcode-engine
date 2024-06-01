import {
  type PlainObject,
  type Spec,
  isJSFunction,
  isJSExpression,
  createCallback,
  EventDisposable,
  createDecorator,
  Provide,
} from '@alilc/lowcode-shared';
import { type ICodeScope, CodeScope } from './codeScope';
import { processValue } from '../../utils/value';

type BeforeResolveCb = (
  code: Spec.JSExpression | Spec.JSFunction,
) => Spec.JSExpression | Spec.JSFunction;

export interface ICodeRuntimeService {
  initialize({ evalCodeFunction }: CodeRuntimeInitializeOptions): void;

  getScope(): ICodeScope;

  run<R = unknown>(code: string, scope?: ICodeScope): R | undefined;

  resolve(value: PlainObject, scope?: ICodeScope): any;

  beforeResolve(fn: BeforeResolveCb): EventDisposable;

  createChildScope(value: PlainObject): ICodeScope;
}

export const ICodeRuntimeService = createDecorator<ICodeRuntimeService>('codeRuntimeService');

export type EvalCodeFunction = (code: string, scope: any) => any;

export interface CodeRuntimeInitializeOptions {
  evalCodeFunction?: EvalCodeFunction;
}

@Provide(ICodeRuntimeService)
export class CodeRuntimeService implements ICodeRuntimeService {
  private codeScope: ICodeScope = new CodeScope({});

  private callbacks = createCallback<BeforeResolveCb>();

  private evalCodeFunction: EvalCodeFunction = evaluate;

  initialize({ evalCodeFunction }: CodeRuntimeInitializeOptions) {
    if (evalCodeFunction) this.evalCodeFunction = evalCodeFunction;
  }

  getScope() {
    return this.codeScope;
  }

  run<R = unknown>(code: string, scope: ICodeScope = this.codeScope): R | undefined {
    if (!code) return undefined;

    try {
      let result = this.evalCodeFunction(code, scope.value);

      if (typeof result === 'function') {
        result = result.bind(scope.value);
      }

      return result as R;
    } catch (err) {
      // todo replace logger
      console.error('%c eval error', code, scope.value, err);
      return undefined;
    }
  }

  resolve(value: PlainObject, scope: ICodeScope = this.codeScope) {
    return processValue(
      value,
      (data) => {
        return isJSExpression(data) || isJSFunction(data);
      },
      (node: Spec.JSExpression | Spec.JSFunction) => {
        const cbs = this.callbacks.list();
        const finalNode = cbs.reduce((node, cb) => cb(node), node);

        const v = this.run(finalNode.value, scope);

        if (typeof v === 'undefined' && finalNode.mock) {
          return this.resolve(finalNode.mock, scope);
        }
        return v;
      },
    );
  }

  beforeResolve(fn: BeforeResolveCb): EventDisposable {
    return this.callbacks.add(fn);
  }

  createChildScope(value: PlainObject): ICodeScope {
    return this.codeScope.createChild(value);
  }
}

function evaluate(code: string, scope: any) {
  return new Function('scope', `"use strict";return (function(){return (${code})}).bind(scope)();`)(
    scope,
  );
}
