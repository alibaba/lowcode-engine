import type { AnyFunction } from '../types';

export type EventName = string | number | symbol;

export function useEvent<T = AnyFunction>() {
  let events: T[] = [];

  function add(fn: T) {
    events.push(fn);

    return () => {
      events = events.filter((e) => e !== fn);
    };
  }

  function remove(fn: T) {
    events = events.filter((f) => fn !== f);
  }

  function list() {
    return [...events];
  }

  return {
    add,
    remove,
    list,
    clear() {
      events.length = 0;
    },
  };
}

export type Event<F = AnyFunction> = ReturnType<typeof useEvent<F>>;

export type HookCallback = (...args: any) => Promise<any> | any;

type HookKeys<T> = keyof T & PropertyKey;

type InferCallback<HT, HN extends keyof HT> = HT[HN] extends HookCallback ? HT[HN] : never;

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
const defaultTask: ReturnType<CreateTask> = { run: (fn) => fn() };
const _createTask: CreateTask = () => defaultTask;
const createTask = typeof console.createTask !== 'undefined' ? console.createTask : _createTask;

export interface HookStore<
  HooksT extends Record<PropertyKey, any> = Record<PropertyKey, HookCallback>,
  HookNameT extends HookKeys<HooksT> = HookKeys<HooksT>,
> {
  hook<NameT extends HookNameT>(name: NameT, fn: InferCallback<HooksT, NameT>): () => void;

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

  remove<NameT extends HookNameT>(name: NameT, fn?: InferCallback<HooksT, NameT>): void;

  clear<NameT extends HookNameT>(name?: NameT): void;

  getHooks<NameT extends HookNameT>(name: NameT): InferCallback<HooksT, NameT>[] | undefined;
}

export function createHookStore<
  HooksT extends Record<PropertyKey, any> = Record<PropertyKey, HookCallback>,
  HookNameT extends HookKeys<HooksT> = HookKeys<HooksT>,
>(): HookStore<HooksT, HookNameT> {
  const hooksMap = new Map<HookNameT, Event<HookCallback>>();

  function hook<NameT extends HookNameT>(name: NameT, fn: InferCallback<HooksT, NameT>) {
    if (!name || typeof fn !== 'function') {
      return () => {};
    }

    let hooks = hooksMap.get(name);
    if (!hooks) {
      hooks = useEvent();
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
      (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
      Promise.resolve(),
    );
  }

  function callParallel<NameT extends HookNameT>(
    name: NameT,
    ...args: Parameters<InferCallback<HooksT, NameT>>
  ) {
    const hooks = hooksMap.get(name)?.list() ?? [];
    const task = createTask(name.toString());
    return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
  }

  function remove<NameT extends HookNameT>(name: NameT, fn?: InferCallback<HooksT, NameT>) {
    const hooks = hooksMap.get(name);
    if (!hooks) return;

    if (fn) {
      hooks.remove(fn);
      if (hooks.list().length === 0) {
        hooksMap.delete(name);
      }
    } else {
      hooksMap.delete(name);
    }
  }

  function clear<NameT extends HookNameT>(name?: NameT) {
    if (name) {
      remove(name);
    } else {
      hooksMap.clear();
    }
  }

  function getHooks<NameT extends HookNameT>(
    name: NameT,
  ): InferCallback<HooksT, NameT>[] | undefined {
    return hooksMap.get(name)?.list() as InferCallback<HooksT, NameT>[] | undefined;
  }

  return {
    hook,

    call,
    callAsync,
    callParallel,

    remove,
    clear,

    getHooks,
  };
}
