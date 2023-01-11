import { IPublicTypeActionContentObject } from '../shell';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isActionContentObject(obj: any): obj is IPublicTypeActionContentObject {
  return obj && typeof obj === 'object';
}
