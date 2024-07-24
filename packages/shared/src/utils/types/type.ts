import { isObject, isFunction } from 'lodash-es';

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    (isObject(val) || isFunction(val)) &&
    isFunction((val as any).then) &&
    isFunction((val as any).catch)
  );
};

export const isEmptyObject = (obj: unknown): obj is object => {
  if (!isObject(obj)) return false;
  for (const key in obj) {
    if (Reflect.has(obj, key)) {
      return false;
    }
  }
  return true;
};
