import { ComponentMap, ProCodeComponentType } from '../npm';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isProCodeComponentType(desc: ComponentMap): desc is ProCodeComponentType {
  return 'package' in desc;
}
