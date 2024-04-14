import { isValidElement } from 'react';
import { IPublicTypeCustomView } from '@alilc/lowcode-types';
import { isReactComponent } from '../is-react';

export function isCustomView(obj: any): obj is IPublicTypeCustomView {
  if (!obj) {
    return false;
  }
  return isValidElement(obj) || isReactComponent(obj);
}
