import { isValidElement } from 'react';
import { isReactComponent } from '../is-react';
import { IPublicTypeCustomView } from '@alilc/lowcode-types';


export function isCustomView(obj: any): obj is IPublicTypeCustomView {
  return obj && (isValidElement(obj) || isReactComponent(obj));
}
