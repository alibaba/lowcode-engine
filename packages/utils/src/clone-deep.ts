import { isPlainObject } from './is-plain-object';

export function cloneDeep(src: any): any {
  const type = typeof src;

  let data: any;
  if (src === null || src === undefined) {
    data = src;
  } else if (Array.isArray(src)) {
    data = src.map(item => cloneDeep(item));
  } else if (type === 'object' && isPlainObject(src)) {
    data = {};
    for (const key in src) {
      // eslint-disable-next-line no-prototype-builtins
      if (src.hasOwnProperty(key)) {
        data[key] = cloneDeep(src[key]);
      }
    }
  } else {
    data = src;
  }

  return data;
}
