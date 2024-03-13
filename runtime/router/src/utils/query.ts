import { type AnyObject } from '@alilc/runtime-shared';
import type { LocationQuery } from '../types';

/**
 * casting numbers into strings, removing keys with an undefined value and replacing
 * undefined with null in arrays
 *
 * 将数字转换为字符，去除值为 undefined 的 keys，将数组中的 undefined 转换为 null
 *
 * @param query - query object to normalize
 * @returns a normalized query object
 */
export function normalizeQuery(query: AnyObject | undefined): LocationQuery {
  const normalizedQuery: AnyObject = {};

  for (const key in query) {
    const value = query[key];
    if (value !== undefined) {
      normalizedQuery[key] = Array.isArray(value)
        ? value.map(v => (v == null ? null : '' + v))
        : value == null
        ? value
        : '' + value;
    }
  }

  return normalizedQuery;
}
