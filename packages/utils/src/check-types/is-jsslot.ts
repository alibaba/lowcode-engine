import { JSSlot } from '@alilc/lowcode-types';

export function isJSSlot(data: any): data is JSSlot {
  return data && data.type === 'JSSlot';
}
