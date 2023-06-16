import { IPublicTypeJSBlock } from '../shell/type/value-type';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isJSBlock(data: any): data is IPublicTypeJSBlock {
  return data && data.type === 'JSBlock';
}
