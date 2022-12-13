import { JSFunction } from '../value-type';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isJSFunction(x: any): x is JSFunction {
  return typeof x === 'object' && x && x.type === 'JSFunction';
}
