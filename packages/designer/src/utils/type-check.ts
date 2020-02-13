import { Component, isValidElement } from 'react';

export function testReactType(obj: any) {
  const t = typeof obj;
  if (t === 'function' && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component)) {
    return 'ReactClass';
  } else if (t === 'object' && isValidElement(obj)) {
    return 'ReactElement';
  }
  return t;
}
