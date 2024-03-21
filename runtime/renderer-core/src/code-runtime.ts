import type { AnyFunction, PlainObject, JSExpression, JSFunction } from './types';
import { isJSExpression, isJSFunction } from './utils/type-guard';
import { processValue } from './utils/value';

export interface CodeRuntime {
  run<T = unknown>(code: string): T | undefined;
  createFnBoundScope(code: string): AnyFunction | undefined;
  parseExprOrFn(value: PlainObject): any;

  bindingScope(scope: CodeScope): void;
  getScope(): CodeScope;
}

const SYMBOL_SIGN = '__code__scope';

export function createCodeRuntime(scopeOrValue: PlainObject = {}): CodeRuntime {
  let runtimeScope = scopeOrValue[Symbol.for(SYMBOL_SIGN)]
    ? (scopeOrValue as CodeScope)
    : createScope(scopeOrValue);

  function run<T = unknown>(code: string): T | undefined {
    if (!code) return undefined;

    try {
      return new Function(
        'scope',
        `"use strict";return (function(){return (${code})}).bind(scope)();`,
      )(runtimeScope.value) as T;
    } catch (err) {
      // todo
      console.error('%c eval error', code, runtimeScope.value, err);
      return undefined;
    }
  }

  function createFnBoundScope(code: string) {
    const fn = run(code);
    if (typeof fn !== 'function') return undefined;
    return fn.bind(runtimeScope.value);
  }

  function parseExprOrFn(value: PlainObject) {
    return processValue(
      value,
      (data) => {
        return isJSExpression(data) || isJSFunction(data);
      },
      (node: JSExpression | JSFunction) => {
        let v;

        if (node.type === 'JSExpression') {
          v = run(node.value);
        } else if (node.type === 'JSFunction') {
          v = createFnBoundScope(node.value);
        }

        if (typeof v === 'undefined' && (node as any).mock) {
          return (node as any).mock;
        }
        return v;
      },
    );
  }

  return {
    run,
    createFnBoundScope,
    parseExprOrFn,

    bindingScope(nextScope) {
      runtimeScope = nextScope;
    },
    getScope() {
      return runtimeScope;
    },
  };
}

export interface CodeScope<T extends PlainObject = PlainObject, K extends keyof T = keyof T> {
  readonly value: T;

  inject(name: K, value: T[K], force?: boolean): void;
  setValue(value: T, replace?: boolean): void;
  createSubScope<O extends PlainObject = PlainObject>(initValue: O): CodeScope<T & O>;
}

export function createScope<T extends PlainObject = PlainObject, K extends keyof T = keyof T>(
  initValue: T,
): CodeScope<T, K> {
  const innerScope = { value: initValue };

  const proxyValue: T = new Proxy(Object.create(null), {
    set(target, p, newValue, receiver) {
      return Reflect.set(target, p, newValue, receiver);
    },
    get(target, p, receiver) {
      let valueTarget = innerScope;

      while (valueTarget) {
        if (Reflect.has(valueTarget.value, p)) {
          return Reflect.get(valueTarget.value, p, receiver);
        }
        valueTarget = (valueTarget as any).__parent;
      }

      return Reflect.get(target, p, receiver);
    },
  });

  const scope: CodeScope<T, K> = {
    get value() {
      // dev return value
      return proxyValue;
    },
    inject(name, value, force = false): void {
      if (innerScope.value[name] && !force) {
        return;
      }
      innerScope.value[name] = value;
    },
    setValue(value, replace = false) {
      if (replace) {
        innerScope.value = { ...value };
      } else {
        innerScope.value = Object.assign({}, innerScope.value, value);
      }
    },
    createSubScope<O extends PlainObject = PlainObject>(initValue: O) {
      const childScope = createScope<O & T>(initValue);

      (childScope as any).__raw.__parent = innerScope;

      return childScope;
    },
  };

  Object.defineProperty(scope, Symbol.for(SYMBOL_SIGN), { get: () => true });
  // development env
  Object.defineProperty(scope, '__raw', { get: () => innerScope });

  return scope;
}
