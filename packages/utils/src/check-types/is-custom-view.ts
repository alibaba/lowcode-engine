import { isValidElement } from 'react';
import { isReactComponent } from '../is-react';
import { CustomView } from '@alilc/lowcode-types';


export function isCustomView(obj: any): obj is CustomView {
  return obj && (isValidElement(obj) || isReactComponent(obj));
}
