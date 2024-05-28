import type { AnyFunction } from '../types';

export function createCallback<T = AnyFunction>() {
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
