import { JSBlock } from '../value-type';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isJSBlock(data: any): data is JSBlock {
  return data && data.type === 'JSBlock';
}
