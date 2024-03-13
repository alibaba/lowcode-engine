import { isPlainObject, isEmpty } from 'lodash-es';

export function someValue(obj: any, predicate: (data: any) => boolean) {
  if (!isPlainObject(obj) || isEmpty(obj)) return false;
  if (predicate(obj)) return true;

  for (const val of Object.values(obj)) {
    if (someValue(val, predicate)) return true;
  }

  return false;
}

export function processValue(
  obj: any,
  predicate: (obj: any) => boolean,
  processor: (node: any, paths: Array<string | number>) => any
): any {
  const innerProcess = (target: any, paths: Array<string | number>): any => {
    if (Array.isArray(target)) {
      return target.map((item, idx) => innerProcess(item, [...paths, idx]));
    }

    if (!isPlainObject(target) || isEmptyObject(target)) return target;
    if (!someValue(target, predicate)) return target;

    if (predicate(target)) {
      return processor(target, paths);
    } else {
      const result = {} as any;
      for (const [key, value] of Object.entries(target)) {
        result[key] = innerProcess(value, [...paths, key]);
      }

      return result;
    }
  };

  return innerProcess(obj, []);
}
