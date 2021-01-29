import adapter from '../adapter';

export function compWrapper(Comp: any) {
  const { createElement, Component, forwardRef } = adapter.getRuntime();
  class Wrapper extends Component {
    constructor(props: any, context: any) {
      super(props, context)
    }

    render() {
      const { forwardRef } = this.props;
      return createElement(Comp, {
        ...this.props,
        ref: forwardRef,
      });
    }
  }

  return forwardRef((props: any, ref: any) => {
    return createElement(Wrapper, { ...props, forwardRef: ref });
  });
}
