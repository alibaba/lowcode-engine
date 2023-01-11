import { isValidElement } from 'react';
import { isReactComponent } from './isReactComponent';
import { IPublicTypeCustomView } from '../shell/type/custom-view';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isCustomView(obj: any): obj is IPublicTypeCustomView {
  return obj && (isValidElement(obj) || isReactComponent(obj));
}
