import { isProCodeComponentType } from './isProCodeComponentType';
import { ComponentMap, LowCodeComponentType } from '../npm';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isLowCodeComponentType(desc: ComponentMap): desc is LowCodeComponentType {
  return !isProCodeComponentType(desc);
}
