import { isReactClass } from '../is-react';
import { DynamicSetter } from '@alilc/lowcode-types';


export function isDynamicSetter(obj: any): obj is DynamicSetter {
  return obj && typeof obj === 'function' && !isReactClass(obj);
}
