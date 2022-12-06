import { ActionContentObject } from '../metadata';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isActionContentObject(obj: any): obj is ActionContentObject {
  return obj && typeof obj === 'object';
}
