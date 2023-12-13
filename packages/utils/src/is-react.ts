import { ComponentClass, Component, FunctionComponent, ComponentType, createElement } from 'react';
import { cloneEnumerableProperty } from './clone-enumerable-property';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;
export const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;

export function isReactClass(obj: any): obj is ComponentClass<any> {
  if (!obj) {
    return false;
  }
  if (obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component)) {
    return true;
  }
  return false;
}

export function acceptsRef(obj: any): boolean {
  if (!obj) {
    return false;
  }
  if (obj?.prototype?.isReactComponent || isForwardOrMemoForward(obj)) {
    return true;
  }

  return false;
}

export function isForwardRefType(obj: any): boolean {
  if (!obj || !obj?.$$typeof) {
    return false;
  }
  return obj?.$$typeof === REACT_FORWARD_REF_TYPE;
}

export function isMemoType(obj: any): boolean {
  if (!obj || !obj?.$$typeof) {
    return false;
  }
  return obj.$$typeof === REACT_MEMO_TYPE;
}

export function isForwardOrMemoForward(obj: any): boolean {
  if (!obj || !obj?.$$typeof) {
    return false;
  }
  return (
    // React.forwardRef(..)
    isForwardRefType(obj) ||
    // React.memo(React.forwardRef(..))
    (isMemoType(obj) && isForwardRefType(obj.type))
  );
}

export function isReactComponent(obj: any): obj is ComponentType<any> {
  if (!obj) {
    return false;
  }

  return Boolean(isReactClass(obj) || typeof obj === 'function' || isForwardRefType(obj) || isMemoType(obj));
}

export function wrapReactClass(view: FunctionComponent) {
  let ViewComponentClass = class extends Component {
    render() {
      const { children, ...other } = this.props;
      return createElement(view, other, children);
    }
  } as any;
  ViewComponentClass = cloneEnumerableProperty(ViewComponentClass, view);
  ViewComponentClass.displayName = view.displayName;
  return ViewComponentClass;
}
