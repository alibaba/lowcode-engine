import { processValue } from '@alilc/lowcode-renderer-core';
import {
  type AnyFunction,
  type PlainObject,
  isJSExpression,
  computed,
  watch,
} from '@alilc/lowcode-shared';
import { type ComponentType, memo, forwardRef, type PropsWithChildren, createElement } from 'react';
import { produce } from 'immer';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export interface ReactiveStore<Snapshot = PlainObject> {
  value: Snapshot;
  onStateChange: AnyFunction | null;
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => Snapshot;
}

function createReactiveStore<Snapshot = PlainObject>(
  target: Record<string, any>,
  predicate: (obj: any) => boolean,
  valueGetter: (expr: any) => any,
): ReactiveStore<Snapshot> {
  let isFlushing = false;
  let isFlushPending = false;

  const cleanups: Array<() => void> = [];
  const waitPathToSetValueMap = new Map();

  const initValue = processValue(target, predicate, (node: any, paths) => {
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
  valueGetter: (expr: any) => any;
  predicate?: (obj: any) => boolean;
  forwardRef?: boolean;
}

export function reactive<TProps extends PlainObject = PlainObject>(
  WrappedComponent: ComponentType<TProps>,
  {
    target,
    valueGetter,
    predicate = isJSExpression,
    forwardRef: forwardRefOption = true,
  }: ReactiveOptions,
): ComponentType<PropsWithChildren<any>> {
  const store = createReactiveStore<TProps>(target, predicate, valueGetter);

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
