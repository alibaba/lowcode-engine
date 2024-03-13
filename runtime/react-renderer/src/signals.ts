import {
  ref,
  computed,
  effect,
  ReactiveEffect,
  type ComputedRef,
  type Ref,
  getCurrentScope,
  isRef,
  isReactive,
  isShallow,
} from '@vue/reactivity';
import {
  noop,
  isObject,
  isPlainObject,
  isSet,
  isMap,
} from '@alilc/runtime-shared';

export { ref as createSignal, computed, effect };
export type { Ref as Signal, ComputedRef as ComputedSignal };

const INITIAL_WATCHER_VALUE = {};

export function watch<T = any>(
  source: Ref<T> | ComputedRef<T> | object,
  cb: (value: any, oldValue: any) => any,
  {
    deep,
    immediate,
  }: {
    deep?: boolean;
    immediate?: boolean;
  } = {}
) {
  let getter: () => any;
  let forceTrigger = false;

  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => {
      return deep === true
        ? source
        : traverse(source, deep === false ? 1 : undefined);
    };
    forceTrigger = true;
  } else {
    getter = () => {};
  }

  if (deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }

  let oldValue = INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active || !effect.dirty) {
      return;
    }

    const newValue = effect.run();

    if (deep || forceTrigger || !Object.is(newValue, oldValue)) {
      cb(newValue, oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue);
      oldValue = newValue;
    }
  };

  const effect = new ReactiveEffect(getter, noop, job);

  const scope = getCurrentScope();
  const unwatch = () => {
    effect.stop();
    if (scope) {
      const i = (scope as any).effects.indexOf(effect);
      if (i > -1) {
        (scope as any).effects.splice(i, 1);
      }
    }
  };

  // initial run
  if (immediate) {
    job();
  } else {
    oldValue = effect.run();
  }

  return unwatch;
}

function traverse(
  value: unknown,
  depth?: number,
  currentDepth = 0,
  seen?: Set<unknown>
) {
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
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
