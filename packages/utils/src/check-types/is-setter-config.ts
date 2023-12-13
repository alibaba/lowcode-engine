import { IPublicTypeSetterConfig } from '@alilc/lowcode-types';
import { isCustomView } from './is-custom-view';
import { isObject } from '../is-object';

export function isSetterConfig(obj: any): obj is IPublicTypeSetterConfig {
  if (!isObject(obj)) {
    return false;
  }
  return 'componentName' in obj && !isCustomView(obj);
}
