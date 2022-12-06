import { JSBlock } from '@alilc/lowcode-types';

export function isJSBlock(data: any): data is JSBlock {
  return data && data.type === 'JSBlock';
}
