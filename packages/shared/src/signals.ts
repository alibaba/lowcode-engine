/**
 * signal apis refs from tc39
 * https://github.com/tc39/template-for-proposals
 * https://github.com/tc39/proposal-signals
 */

import { AnyFunction, type PlainObject } from './types';
import {
  ref,
  computed,
  ReactiveEffect,
  type ComputedRef,
  type Ref,
  getCurrentScope,
  isRef,
  isReactive,
  isShallow,
  EffectScheduler,
} from '@vue/reactivity';
import { noop, isObject, isPlainObject, isSet, isMap, isFunction } from 'lodash-es';
import { isPromise } from './utils';

export { ref as signal, computed, watchEffect as effect, watch as reaction, isRef as isSignal };
export type { Ref as Signal, ComputedRef as ComputedSignal };

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T);
export type WatchEffect = (onCleanup: OnCleanup) => void;

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: OnCleanup,
) => any;

type OnCleanup = (cleanupFn: () => void) => void;

export interface WatchOptions<Immediate = boolean> {
  immediate?: Immediate;
  deep?: boolean;
  once?: boolean;
}

const INITIAL_WATCHER_VALUE = {};

type MultiWatchSources = (WatchSource<unknown> | object)[];

export type WatchStopHandle = () => void;

// Simple effect.
export function watchEffect(effect: WatchEffect): WatchStopHandle {
  return doWatch(effect, null);
}

type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
      ? Immediate extends true
        ? T[K] | undefined
        : T[K]
      : never;
};

// overload: single source + cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;

// overload: array of multiple sources + cb
export function watch<T extends MultiWatchSources, Immediate extends Readonly<boolean> = false>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;

// overload: multiple sources w/ `as const`
// watch([foo, bar] as const, () => {})
// somehow [...T] breaks when the type is readonly
export function watch<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;

// overload: watching reactive object w/ cb
export function watch<T extends object, Immediate extends Readonly<boolean> = false>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>,
): WatchStopHandle;

// implementation
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>,
): WatchStopHandle {
  if (!isFunction(cb)) {
    console.warn(
      `\`watch(fn, options?)\` signature has been moved to a separate API. ` +
        `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
        `supports \`watch(source, cb, options?) signature.`,
    );
  }
  return doWatch(source as any, cb, options);
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  { deep, immediate, once }: WatchOptions = {},
) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }

  const warnInvalidSource = (s: unknown) => {
    console.warn(
      `Invalid watch source: `,
      s,
      `A watch source can only be a getter/effect function, a ref, ` +
        `a reactive object, or an array of these types.`,
    );
  };

  const reactiveGetter = (source: object) =>
    deep === true
      ? source // traverse will happen in wrapped getter below
      : // for deep: false, only traverse root-level properties
        traverse(source, deep === false ? 1 : undefined);

  let getter: () => any;
  let forceTrigger = false;
  let isMultiSource = false;

  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (Array.isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () =>
      source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return reactiveGetter(s);
        } else {
          warnInvalidSource(s);
        }
      });
  } else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () => callWithErrorHandling(source);
    } else {
      // no cb -> simple effect
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, [onCleanup]);
      };
    }
  } else {
    getter = noop;
    warnInvalidSource(source);
  }

  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  let cleanup: (() => void) | undefined;
  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn);
      cleanup = effect.onStop = undefined;
    };
  };

  let oldValue: any = isMultiSource
    ? new Array((source as []).length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE;

  const scheduler: EffectScheduler = () => {
    if (!effect.active || !effect.dirty) {
      return;
    }
    if (cb) {
      // watch(source, cb)
      const newValue = effect.run();
      if (
        deep ||
        forceTrigger ||
        (isMultiSource
          ? (newValue as any[]).some((v, i) => hasChanged(v, oldValue[i]))
          : hasChanged(newValue, oldValue))
      ) {
        // cleanup before running cb again
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE
            ? undefined
            : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE
              ? []
              : oldValue,
          onCleanup,
        ]);
        oldValue = newValue;
      }
    } else {
      // watchEffect
      effect.run();
    }
  };

  const effect = new ReactiveEffect(getter, noop, scheduler);

  const scope = getCurrentScope();
  const unwatch = () => {
    effect.stop();
    if (scope) {
      remove((scope as any).effects, effect);
    }
  };

  // initial run
  if (cb) {
    if (immediate) {
      scheduler();
    } else {
      oldValue = effect.run();
    }
  } else {
    effect.run();
  }

  return unwatch;
}

function traverse(value: unknown, depth?: number, currentDepth = 0, seen?: Set<unknown>) {
  if (!isObject(value)) {
    return value;
  }

  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }

  seen = seen || new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse((value as PlainObject)[key], depth, currentDepth, seen);
    }
  }

  return value;
}

function callWithErrorHandling(fn: AnyFunction, args?: unknown[]) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    console.error(err);
  }
}

function callWithAsyncErrorHandling(fn: AnyFunction | AnyFunction[], args?: unknown[]): any {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        console.error(err);
      });
    }
    return res;
  }

  if (Array.isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], args));
    }
    return values;
  }
}

const remove = <T>(arr: T[], el: T) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};

// compare whether a value has changed, accounting for NaN.
const hasChanged = (value: any, oldValue: any): boolean => !Object.is(value, oldValue);
