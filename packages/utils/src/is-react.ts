import { ComponentClass, Component, FunctionComponent, ComponentType, createElement } from 'react';
import { cloneEnumerableProperty } from './clone-enumerable-property';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;
const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;

export function isReactClass(obj: any): obj is ComponentClass<any> {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}

export function acceptsRef(obj: any): boolean {
  return obj?.prototype?.isReactComponent || (obj.$$typeof && obj.$$typeof === REACT_FORWARD_REF_TYPE);
}

function isForwardRefType(obj: any): boolean {
  return obj?.$$typeof && obj?.$$typeof === REACT_FORWARD_REF_TYPE;
}

function isMemoType(obj: any): boolean {
  return obj?.$$typeof && obj.$$typeof === REACT_MEMO_TYPE;
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
