import { RawRouteLocation } from '@alilc/renderer-core';
import { type RouteLocationNormalized } from './types';
import { isRouteLocation } from './utils/helper';

export type NavigationHookAfter = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) => any;

export type NavigationGuardReturn = undefined | Error | RawRouteLocation | boolean;

/**
 * Navigation guard.
 */
export interface NavigationGuard {
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ): NavigationGuardReturn | Promise<NavigationGuardReturn>;
}

export function guardToPromiseFn(
  guard: NavigationGuard,
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
): () => Promise<void> {
  return () =>
    new Promise((resolve, reject) => {
      const next = (valid?: boolean | RawRouteLocation | Error) => {
        if (valid === false) {
          reject();
        } else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          // todo reject (error)
          reject();
        } else {
          resolve();
        }
      };

      // 使用 Promise.resolve 包装允许它与异步和同步守卫一起工作
      const guardReturn = guard.call(null, to, from);

      return Promise.resolve(guardReturn)
        .then(next)
        .catch((err) => reject(err));
    });
}
