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

export interface CodeScope {
  readonly value: PlainObject;

  inject(name: string, value: any, force?: boolean): void;
  setValue(value: PlainObject, replace?: boolean): void;
  createSubScope(initValue?: PlainObject): CodeScope;
}

export function createScope(initValue: PlainObject = {}): CodeScope {
  const innerScope = { value: initValue };
  const proxyValue = new Proxy(Object.create(null), {
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

  function inject(name: string, value: any, force = false): void {
    if (innerScope.value[name] && !force) {
      console.warn(`${name} 已存在值`);
      return;
    }

    innerScope.value[name] = value;
  }

  function createSubScope(initValue: PlainObject = {}) {
    const childScope = createScope(initValue);

    (childScope as any).__raw.__parent = innerScope;

    return childScope;
  }

  const scope: CodeScope = {
    get value() {
      // dev return value
      return proxyValue;
    },
    inject,
    setValue(value, replace = false) {
      if (replace) {
        innerScope.value = { ...value };
      } else {
        innerScope.value = Object.assign({}, innerScope.value, value);
      }
    },
    createSubScope,
  };

  Object.defineProperty(scope, Symbol.for(SYMBOL_SIGN), { get: () => true });
  // development env
  Object.defineProperty(scope, '__raw', { get: () => innerScope });

  return scope;
}
