import { Icon } from '@alifd/next';
import { isValidElement, ReactNode, createElement, cloneElement } from 'react';
import { isReactComponent } from './is-react';
import { IconType } from '../types';

const URL_RE = /^(https?:)\/\//i;

export function createIcon(icon?: IconType | null, props?: object): ReactNode {
  if (!icon) {
    return null;
  }
  if (typeof icon === 'string') {
    if (URL_RE.test(icon)) {
      return <img src={icon} {...props} />;
    }
    return <Icon type={icon} {...props} />;
  }
  if (isValidElement(icon)) {
    return cloneElement(icon, {...props});
  }
  if (isReactComponent(icon)) {
    return createElement(icon, {...props});
  }

  return <Icon {...icon} {...props} />;
}
