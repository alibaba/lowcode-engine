import { JSSlot } from '../value-type';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isJSSlot(data: any): data is JSSlot {
  return data && data.type === 'JSSlot';
}
