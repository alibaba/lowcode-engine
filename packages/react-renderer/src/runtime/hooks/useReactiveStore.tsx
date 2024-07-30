import { mapValue } from '@alilc/lowcode-renderer-core';
import {
  type AnyFunction,
  type StringDictionary,
  specTypes,
  Signals,
  invariant,
} from '@alilc/lowcode-shared';
import { useRef } from 'react';
import { produce } from 'immer';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

interface ReactiveOptions {
  target: StringDictionary;
  getter?: (obj: any) => any;
  valueGetter?: (expr: any) => any;
  filter?: (obj: any) => boolean;
}

export interface ReactiveStore<Snapshot = StringDictionary> {
  value: Snapshot | null;
  onStateChange: AnyFunction | null;
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => Snapshot | null;
}

function createReactiveStore<Snapshot = StringDictionary>(
  options: ReactiveOptions,
): ReactiveStore<Snapshot> {
  const { target, getter, filter = specTypes.isJSExpression, valueGetter } = options;

  invariant(
    getter || valueGetter,
    'Either the processor option or the valueGetter option must be provided.',
  );

  let isFlushing = false;
  let isFlushPending = false;

  const cleanups: Array<() => void> = [];
  const waitPathToSetValueMap = new Map();

  const store: ReactiveStore<Snapshot> = {
    value: null,
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

  if (getter) {
    const computedValue = Signals.computed<any>(() => getter(target));

    cleanups.push(
      Signals.watch(
        computedValue,
        (newValue) => {
          Promise.resolve().then(() => {
            store.value = newValue;
            store.onStateChange?.();
          });
        },
        { immediate: true },
      ),
    );
  } else if (valueGetter) {
    const initValue = mapValue(target, filter, (node: any, paths) => {
      const computedValue = Signals.computed(() => valueGetter(node));
      const unwatch = Signals.watch(computedValue, (newValue) => {
        waitPathToSetValueMap.set(paths, newValue);

        if (!isFlushPending && !isFlushing) {
          isFlushPending = true;
          Promise.resolve().then(updateStoreValue);
        }
      });

      cleanups.push(unwatch);
      updateStoreValue();

      return computedValue.value;
    });

    store.value = initValue;
  }

  function updateStoreValue() {
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
          waitPathToSetValueMap.delete(paths);
        });
      });
    }

    store.onStateChange?.();
    isFlushing = false;
  }

  return store;
}

export function useReactiveStore(options: ReactiveOptions) {
  const storeRef = useRef<ReactiveStore>();

  if (!storeRef.current) {
    storeRef.current = createReactiveStore(options);
  }

  const store = storeRef.current;

  return useSyncExternalStore(store.subscribe, store.getSnapshot) as any;
}
