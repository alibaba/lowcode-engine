import { type PlainObject } from '@alilc/lowcode-shared';
import { isPlainObject, isEmpty } from 'lodash-es';

export function someValue(
  obj: PlainObject | PlainObject[],
  filter: (data: PlainObject) => boolean,
): boolean {
  if (Array.isArray(obj)) {
    return obj.some((item) => someValue(item, filter));
  }

  if (!isPlainObject(obj) || isEmpty(obj)) return false;
  if (filter(obj)) return true;

  return Object.values(obj).some((val) => someValue(val, filter));
}

export function mapValue(
  obj: PlainObject,
  filter: (obj: PlainObject) => boolean,
  callback: (node: any, paths: Array<string | number>) => any,
): any {
  if (!someValue(obj, filter)) return obj;

  const mapping = (target: any, paths: Array<string | number>): any => {
    if (Array.isArray(target)) {
      return target.map((item, idx) => mapping(item, [...paths, idx]));
    }

    if (!isPlainObject(target) || isEmpty(target)) return target;

    if (filter(target)) {
      return callback(target, paths);
    }

    const result: PlainObject = {};

    for (const [key, value] of Object.entries(target)) {
      result[key] = mapping(value, [...paths, key]);
    }

    return result;
  };

  return mapping(obj, []);
}
