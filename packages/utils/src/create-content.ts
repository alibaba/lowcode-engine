import { ReactNode, ComponentType, isValidElement, cloneElement, createElement } from 'react';
import { isReactComponent } from './is-react';

export function createContent(
  content: ReactNode | ComponentType<any>,
  props?: Record<string, unknown>,
): ReactNode {
  if (isValidElement(content)) {
    return props ? cloneElement(content, props) : content;
  }
  if (isReactComponent(content)) {
    return createElement(content, props);
  }

  return content;
}
