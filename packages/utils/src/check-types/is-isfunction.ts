import { JSFunction } from '@alilc/lowcode-types';

export function isJSFunction(x: any): x is JSFunction {
  return typeof x === 'object' && x && x.type === 'JSFunction';
}
