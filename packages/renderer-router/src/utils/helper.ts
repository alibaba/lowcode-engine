import type { RawRouteLocation } from '@alilc/renderer-core';
import type { RouteLocationNormalized } from '../types';

export function isRouteLocation(route: any): route is RawRouteLocation {
  return typeof route === 'string' || (route && typeof route === 'object');
}

export function isSameRouteLocation(
  a: RouteLocationNormalized,
  b: RouteLocationNormalized,
): boolean {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;

  return (
    aLastIndex > -1 &&
    aLastIndex === bLastIndex &&
    a.matched[aLastIndex] === b.matched[bLastIndex] &&
    isSameRouteLocationParams(a.params, b.params) &&
    a.searchParams?.toString() === b.searchParams?.toString() &&
    a.hash === b.hash
  );
}

export function isSameRouteLocationParams(
  a: RouteLocationNormalized['params'],
  b: RouteLocationNormalized['params'],
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;

  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
  }

  return true;
}

function isSameRouteLocationParamsValue(
  a: undefined | string | string[],
  b: undefined | string | string[],
): boolean {
  return Array.isArray(a)
    ? isEquivalentArray(a, b)
    : Array.isArray(b)
      ? isEquivalentArray(b, a)
      : a === b;
}

function isEquivalentArray<T>(a: readonly T[], b: readonly T[] | T): boolean {
  return Array.isArray(b)
    ? a.length === b.length && a.every((value, i) => value === b[i])
    : a.length === 1 && a[0] === b;
}
