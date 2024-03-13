import {
  type RouteLocation,
  type RouteLocationRaw,
} from '@alilc/runtime-shared';
import { isRouteLocation } from './utils/helper';

export type NavigationHookAfter = (
  to: RouteLocation,
  from: RouteLocation
) => any;

export type NavigationGuardReturn =
  | void
  | Error
  | RouteLocationRaw
  | boolean
  | NavigationGuardNextCallback;

export type NavigationGuardNextCallback = () => any;

export interface NavigationGuardNext {
  (): void;
  (error: Error): void;
  (location: RouteLocationRaw): void;
  (valid: boolean | undefined): void;
  (cb: NavigationGuardNextCallback): void;
  /**
   * Allows to detect if `next` isn't called in a resolved guard. Used
   * internally in DEV mode to emit a warning. Commented out to simplify
   * typings.
   * @internal
   */
  _called?: boolean;
}

/**
 * Navigation guard.
 */
export interface NavigationGuard {
  (to: RouteLocation, from: RouteLocation, next: NavigationGuardNext):
    | NavigationGuardReturn
    | Promise<NavigationGuardReturn>;
}

export function guardToPromiseFn(
  guard: NavigationGuard,
  to: RouteLocation,
  from: RouteLocation
): () => Promise<void> {
  return () =>
    new Promise((resolve, reject) => {
      const next: NavigationGuardNext = (
        valid?: boolean | RouteLocationRaw | NavigationGuardNextCallback | Error
      ) => {
        if (valid === false) {
          reject();
        } else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          // todo
          // reject(
          //   createRouterError<NavigationRedirectError>(
          //     ErrorTypes.NAVIGATION_GUARD_REDIRECT,
          //     {
          //       from: to,
          //       to: valid
          //     }
          //   )
          // );
          reject();
        } else {
          resolve();
        }
      };

      // 使用 Promise.resolve 包装允许它与异步和同步守卫一起工作
      const guardReturn = guard.call(
        null,
        to,
        from,
        canOnlyBeCalledOnce(next, to, from)
      );
      let guardCall = Promise.resolve(guardReturn);

      if (guard.length <= 2) guardCall = guardCall.then(next);
      if (guard.length > 2) {
        const message = `The "next" callback was never called inside of ${
          guard.name ? '"' + guard.name + '"' : ''
        }:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;

        if (typeof guardReturn === 'object' && 'then' in guardReturn) {
          guardCall = guardCall.then(resolvedValue => {
            if (!next._called) {
              console.warn(message);
              return Promise.reject(new Error('Invalid navigation guard'));
            }
            return resolvedValue;
          });
        } else if (guardReturn !== undefined) {
          if (!next._called) {
            console.warn(message);
            reject(new Error('Invalid navigation guard'));
            return;
          }
        }
      }
      guardCall.catch(err => reject(err));
    });
}

function canOnlyBeCalledOnce(
  next: NavigationGuardNext,
  to: RouteLocation,
  from: RouteLocation
): NavigationGuardNext {
  let called = 0;
  return function () {
    if (called++ === 1) {
      console.warn(
        `The "next" callback was called more than once in one navigation guard when going from "${from.fullPath}" to "${to.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`
      );
    }
    next._called = true;
    if (called === 1) {
      next.apply(null, arguments as any);
    }
  };
}
