import { SetterConfig } from '../setter-config';
import { isCustomView } from './isCustomView';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isSetterConfig(obj: any): obj is SetterConfig {
  return obj && typeof obj === 'object' && 'componentName' in obj && !isCustomView(obj);
}
