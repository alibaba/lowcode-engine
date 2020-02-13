import { ReactNode, ComponentType, isValidElement, cloneElement, createElement, ReactElement } from 'react';
import { isReactClass } from './is-react';

export function createContent(content: ReactNode | ComponentType<any>, props?: object): ReactNode {
  if (isValidElement(content)) {
    return props ? cloneElement(content, props) : content;
  }
  if (isReactClass(content)) {
    return createElement(content, props);
  }

  if (typeof content === 'function') {
    return content(props) as ReactElement;
  }

  return content;
}
