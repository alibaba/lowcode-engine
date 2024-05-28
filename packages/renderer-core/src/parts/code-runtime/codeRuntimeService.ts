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

export interface ICodeRuntimeService {
  getScope(): ICodeScope;

  run<R = unknown>(code: string, scope?: ICodeScope): R | undefined;

  resolve(value: PlainObject, scope?: ICodeScope): any;

  beforeRun(fn: (code: string) => string): EventDisposable;

  createChildScope(value: PlainObject): ICodeScope;
}

export const ICodeRuntimeService = createDecorator<ICodeRuntimeService>('codeRuntimeService');

@Provide(ICodeRuntimeService)
export class CodeRuntimeService implements ICodeRuntimeService {
  private codeScope: ICodeScope = new CodeScope({});

  private callbacks = createCallback<(code: string) => string>();

  getScope() {
    return this.codeScope;
  }

  run<R = unknown>(code: string, scope: ICodeScope = this.codeScope): R | undefined {
    if (!code) return undefined;

    try {
      const cbs = this.callbacks.list();
      const finalCode = cbs.reduce((code, cb) => cb(code), code);

      let result = new Function(
        'scope',
        `"use strict";return (function(){return (${finalCode})}).bind(scope)();`,
      )(scope.value);

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
        const v = this.run(node.value, scope);

        if (typeof v === 'undefined' && (node as any).mock) {
          return (node as any).mock;
        }
        return v;
      },
    );
  }

  beforeRun(fn: (code: string) => string): EventDisposable {
    return this.callbacks.add(fn);
  }

  createChildScope(value: PlainObject): ICodeScope {
    return this.codeScope.createChild(value);
  }
}
