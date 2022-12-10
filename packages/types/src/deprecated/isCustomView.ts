import { isValidElement } from 'react';
import { isReactComponent } from './isReactComponent';
import { CustomView } from '../setter-config';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isCustomView(obj: any): obj is CustomView {
  return obj && (isValidElement(obj) || isReactComponent(obj));
}
