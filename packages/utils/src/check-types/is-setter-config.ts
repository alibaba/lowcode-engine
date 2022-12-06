import { SetterConfig } from '@alilc/lowcode-types';
import { isCustomView } from './is-custom-view';


export function isSetterConfig(obj: any): obj is SetterConfig {
  return obj && typeof obj === 'object' && 'componentName' in obj && !isCustomView(obj);
}
