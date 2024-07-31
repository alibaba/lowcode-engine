import { type StringDictionary } from '@alilc/lowcode-shared';
import { isPlainObject, isEmpty } from 'lodash-es';

export function someValue(
  obj: StringDictionary | StringDictionary[],
  filter: (data: StringDictionary) => boolean,
): boolean {
  if (Array.isArray(obj)) {
    return obj.some((item) => someValue(item, filter));
  }

  if (!isPlainObject(obj) || isEmpty(obj)) return false;
  if (filter(obj)) return true;

  return Object.values(obj).some((val) => someValue(val, filter));
}

export function mapValue(
  obj: StringDictionary,
  filter: (obj: StringDictionary) => boolean,
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

    const result: StringDictionary = {};

    for (const [key, value] of Object.entries(target)) {
      result[key] = mapping(value, [...paths, key]);
    }

    return result;
  };

  return mapping(obj, []);
}
