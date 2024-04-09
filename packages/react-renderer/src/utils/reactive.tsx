import {
  processValue,
  type AnyFunction,
  type PlainObject,
  type JSExpression,
  isJSExpression,
} from '@alilc/lowcode-renderer-core';
import { type ComponentType, memo, forwardRef, type PropsWithChildren, createElement } from 'react';
import { produce } from 'immer';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { computed, watch } from '../signals';

export interface ReactiveStore<Snapshot = PlainObject> {
  value: Snapshot;
  onStateChange: AnyFunction | null;
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => Snapshot;
}

function createReactiveStore<Snapshot = PlainObject>(
  target: Record<string, any>,
  valueGetter: (expr: JSExpression) => any,
): ReactiveStore<Snapshot> {
  let isFlushing = false;
  let isFlushPending = false;

  const cleanups: Array<() => void> = [];
  const waitPathToSetValueMap = new Map();

  const initValue = processValue(target, isJSExpression, (node: JSExpression, paths) => {
    const computedValue = computed(() => valueGetter(node));
    const unwatch = watch(computedValue, (newValue) => {
      waitPathToSetValueMap.set(paths, newValue);

      if (!isFlushPending && !isFlushing) {
        isFlushPending = true;
        Promise.resolve().then(genValue);
      }
    });

    cleanups.push(unwatch);

    return computedValue.value;
  });

  const genValue = () => {
    isFlushPending = false;
    isFlushing = true;

    if (waitPathToSetValueMap.size > 0) {
      store.value = produce(store.value, (draft: any) => {
        waitPathToSetValueMap.forEach((value, paths) => {
          if (paths.length === 1) {
            draft[paths[0]] = value;
          } else if (paths.length > 1) {
            let target = draft;
            let i = 0;
            for (; i < paths.length - 1; i++) {
              target = draft[paths[i]];
            }
            target[paths[i]] = value;
          }
        });
      });
    }

    waitPathToSetValueMap.clear();
    store.onStateChange?.();
    isFlushing = false;
  };

  const store: ReactiveStore<Snapshot> = {
    value: initValue,
    onStateChange: null,
    subscribe(callback: () => void) {
      store.onStateChange = callback;

      return () => {
        store.onStateChange = null;

        cleanups.forEach((c) => c());
        cleanups.length = 0;
      };
    },
    getSnapshot() {
      return store.value;
    },
  };

  return store;
}

interface ReactiveOptions {
  target: PlainObject;
  valueGetter: (expr: JSExpression) => any;
  forwardRef?: boolean;
}

export function reactive<TProps extends PlainObject = PlainObject>(
  WrappedComponent: ComponentType<TProps>,
  { target, valueGetter, forwardRef: forwardRefOption = true }: ReactiveOptions,
): ComponentType<PlainObject> {
  const store = createReactiveStore(target, valueGetter);

  function WrapperComponent(props: any, ref: any) {
    const actualProps = useSyncExternalStore(store.subscribe, store.getSnapshot);

    return createElement(WrappedComponent, {
      ...props,
      ...actualProps,
      ref,
    });
  }

  const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  const displayName = `Reactive(${componentName})`;

  const _Reactived = forwardRefOption ? forwardRef(WrapperComponent) : WrapperComponent;
  const Reactived = memo(_Reactived) as unknown as ComponentType<PropsWithChildren<TProps>>;

  Reactived.displayName = WrappedComponent.displayName = displayName;

  return hoistNonReactStatics(Reactived, WrappedComponent);
}
