import { isReactClass } from './isReactClass';
import { DynamicSetter } from '../setter-config';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isDynamicSetter(obj: any): obj is DynamicSetter {
  return obj && typeof obj === 'function' && !isReactClass(obj);
}
