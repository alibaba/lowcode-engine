import { cloneEnumerableProperty } from '@alilc/lowcode-utils';
import adapter from '../adapter';

export function compWrapper(Comp: any) {
  const { createElement, Component, forwardRef } = adapter.getRuntime();
  class Wrapper extends Component {
    // constructor(props: any, context: any) {
    //   super(props, context);
    // }

    render() {
      return createElement(Comp, this.props);
    }
  }

  return cloneEnumerableProperty(forwardRef((props: any, ref: any) => {
    return createElement(Wrapper, { ...props, forwardRef: ref });
  }), Comp);
}
