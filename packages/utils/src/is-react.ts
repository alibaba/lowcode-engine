import { ComponentClass, Component, FunctionComponent, ComponentType } from 'react';

const hasSymbol = typeof Symbol === 'function' && Symbol.for;
const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;

export function isReactClass(obj: any): obj is ComponentClass<any> {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}

export function acceptsRef(obj: any): boolean {
  return obj?.prototype?.isReactComponent || (obj.$$typeof && obj.$$typeof === REACT_FORWARD_REF_TYPE);
}

function isForwardRefType(obj: any): boolean {
  return obj?.$$typeof && obj?.$$typeof === REACT_FORWARD_REF_TYPE;
}

export function isReactComponent(obj: any): obj is ComponentType<any> {
  return obj && (isReactClass(obj) || typeof obj === 'function' || isForwardRefType(obj));
}

export function wrapReactClass(view: FunctionComponent) {
  const ViewComponentClass = class extends Component {
    render() {
      return view(this.props);
    }
  } as any;
  ViewComponentClass.displayName = view.displayName;
  return ViewComponentClass;
}
