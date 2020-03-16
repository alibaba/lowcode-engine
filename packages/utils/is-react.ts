import { ComponentClass, Component, ComponentType } from 'react';

export function isReactClass(obj: any): obj is ComponentClass<any> {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}

export function isReactComponent(obj: any): obj is ComponentType<any> {
  return obj && (isReactClass(obj) || typeof obj === 'function');
}
