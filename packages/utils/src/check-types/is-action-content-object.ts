import { ActionContentObject } from '@alilc/lowcode-types';


export function isActionContentObject(obj: any): obj is ActionContentObject {
  return obj && typeof obj === 'object';
}
