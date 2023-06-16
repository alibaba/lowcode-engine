import { IPublicTypeActionContentObject } from '@alilc/lowcode-types';

export function isActionContentObject(obj: any): obj is IPublicTypeActionContentObject {
  return obj && typeof obj === 'object';
}
