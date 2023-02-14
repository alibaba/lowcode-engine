import { IPublicTypeJSSlot } from '@alilc/lowcode-types';

export function isJSSlot(data: any): data is IPublicTypeJSSlot {
  return data && data.type === 'JSSlot';
}
