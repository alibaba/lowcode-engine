import { isObject } from './is-object';

export function isPlainObject<T extends object = object>(value: any): value is T {
  if (!isObject(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null;
}
