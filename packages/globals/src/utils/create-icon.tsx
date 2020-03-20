import { Icon } from '@alifd/next';
import { isValidElement, ReactNode, ComponentType, createElement, cloneElement, ReactElement } from 'react';
import { isReactComponent } from './is-react';

export interface IconConfig {
  type: string;
  size?: number | 'small' | 'xxs' | 'xs' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'inherit';
  className?: string;
}

export type IconType = string | ReactElement | ComponentType<any> | IconConfig;

const URL_RE = /^(https?:)\/\//i;

export function createIcon(icon: IconType, props?: object): ReactNode {
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

  if (icon) {
    return <Icon {...icon} {...props} />;
  }

  return null;
}
