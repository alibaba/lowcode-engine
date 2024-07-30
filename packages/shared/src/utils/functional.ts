import { AnyFunction } from '../types';

/**
 * Given a function, returns a function that is only calling that function once.
 */
export function createSingleCallFunction<T extends AnyFunction>(
  this: unknown,
  fn: T,
  fnDidRunCallback?: () => void,
): T {
  const _this = this;
  let didCall = false;
  let result: unknown;

  return function (...args: any[]) {
    if (didCall) {
      return result;
    }

    didCall = true;
    if (fnDidRunCallback) {
      try {
        result = fn.apply(_this, args);
      } finally {
        fnDidRunCallback();
      }
    } else {
      result = fn.apply(_this, args);
    }

    return result;
  } as unknown as T;
}
