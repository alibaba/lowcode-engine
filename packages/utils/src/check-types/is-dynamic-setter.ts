import { isReactClass } from '../is-react';
import { IPublicTypeDynamicSetter } from '@alilc/lowcode-types';


export function isDynamicSetter(obj: any): obj is IPublicTypeDynamicSetter {
  return obj && typeof obj === 'function' && !isReactClass(obj);
}
