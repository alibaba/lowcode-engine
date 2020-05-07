import { isObject } from './is-object';

export function isPlainObject(value: any): value is object {
  if (!isObject(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null;
}
