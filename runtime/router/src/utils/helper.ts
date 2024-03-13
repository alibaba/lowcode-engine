import {
  type RouteLocation,
  type RouteLocationRaw,
} from '@alilc/runtime-shared';

export function isRouteLocation(route: any): route is RouteLocationRaw {
  return typeof route === 'string' || (route && typeof route === 'object');
}

export function isSameRouteLocation(
  a: RouteLocation,
  b: RouteLocation
): boolean {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;

  return (
    aLastIndex > -1 &&
    aLastIndex === bLastIndex &&
    a.matched[aLastIndex] === b.matched[bLastIndex] &&
    isSameRouteLocationParams(a.params, b.params) &&
    a.query?.toString() === b.query?.toString() &&
    a.hash === b.hash
  );
}

export function isSameRouteLocationParams(
  a: RouteLocation['params'],
  b: RouteLocation['params']
): boolean {
  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
  }

  return true;
}

function isSameRouteLocationParamsValue(
  a: string | readonly string[],
  b: string | readonly string[]
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
