import { useCallbacks, type Callback } from '@alilc/runtime-shared';

export type HookCallback = (...args: any) => Promise<void> | void;
type HookKeys<T> = keyof T & PropertyKey;

type InferCallback<HT, HN extends keyof HT> = HT[HN] extends HookCallback
  ? HT[HN]
  : never;

declare global {
  interface Console {
    // https://developer.chrome.com/blog/devtools-modern-web-debugging/#linked-stack-traces
    createTask(name: string): {
      run: <T extends () => any>(fn: T) => ReturnType<T>;
    };
  }
}

// https://developer.chrome.com/blog/devtools-modern-web-debugging/#linked-stack-traces
type CreateTask = typeof console.createTask;
const defaultTask: ReturnType<CreateTask> = { run: fn => fn() };
const _createTask: CreateTask = () => defaultTask;
const createTask =
  typeof console.createTask !== 'undefined' ? console.createTask : _createTask;

export interface Hooks<
  HooksT extends Record<PropertyKey, any> = Record<PropertyKey, HookCallback>,
  HookNameT extends HookKeys<HooksT> = HookKeys<HooksT>
> {
  hook<NameT extends HookNameT>(
    name: NameT,
    fn: InferCallback<HooksT, NameT>
  ): () => void;
  call<NameT extends HookNameT>(
    name: NameT,
    ...args: Parameters<InferCallback<HooksT, NameT>>
  ): void;
  callAsync<NameT extends HookNameT>(
    name: NameT,
    ...args: Parameters<InferCallback<HooksT, NameT>>
  ): Promise<void>;
  callParallel<NameT extends HookNameT>(
    name: NameT,
    ...args: Parameters<InferCallback<HooksT, NameT>>
  ): Promise<void[]>;
  remove<NameT extends HookNameT>(
    name: NameT,
    fn?: InferCallback<HooksT, NameT>
  ): void;
}

export function createHooks<
  HooksT extends Record<PropertyKey, any> = Record<PropertyKey, HookCallback>,
  HookNameT extends HookKeys<HooksT> = HookKeys<HooksT>
>(): Hooks<HooksT, HookNameT> {
  const hooksMap = new Map<HookNameT, Callback<HookCallback>>();

  function hook<NameT extends HookNameT>(
    name: NameT,
    fn: InferCallback<HooksT, NameT>
  ) {
    if (!name || typeof fn !== 'function') {
      return () => {};
    }

    let hooks = hooksMap.get(name);
    if (!hooks) {
      hooks = useCallbacks();
      hooksMap.set(name, hooks);
    }

    hooks.add(fn);
    return () => remove(name, fn);
  }

  function call<NameT extends HookNameT>(
    name: NameT,
    ...args: Parameters<InferCallback<HooksT, NameT>>
  ) {
    const hooks = hooksMap.get(name)?.list() ?? [];

    for (const hookFn of hooks) {
      hookFn.call(null, ...args);
    }
  }

  function callAsync<NameT extends HookNameT>(
    name: NameT,
    ...args: Parameters<InferCallback<HooksT, NameT>>
  ) {
    const hooks = hooksMap.get(name)?.list() ?? [];
    const task = createTask(name.toString());

    return hooks.reduce(
      (promise, hookFunction) =>
        promise.then(() => task.run(() => hookFunction(...args))),
      Promise.resolve()
    );
  }

  function callParallel<NameT extends HookNameT>(
    name: NameT,
    ...args: Parameters<InferCallback<HooksT, NameT>>
  ) {
    const hooks = hooksMap.get(name)?.list() ?? [];
    const task = createTask(name.toString());
    return Promise.all(hooks.map(hook => task.run(() => hook(...args))));
  }

  function remove<NameT extends HookNameT>(
    name: NameT,
    fn?: InferCallback<HooksT, NameT>
  ) {
    const hooks = hooksMap.get(name);
    if (!hooks) return;

    if (fn) {
      hooks.remove(fn);
      if (hooks.list.length === 0) {
        hooksMap.delete(name);
      }
    } else {
      hooksMap.delete(name);
    }
  }

  return {
    hook,
    call,
    callAsync,
    callParallel,
    remove,
  };
}
