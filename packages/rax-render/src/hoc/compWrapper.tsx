// @ts-nocheck
import { createElement, Component, forwardRef } from 'rax';

export default function (Comp) {
  class compWrapper extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props, context) {
      super(props, context);
    }

    render() {
      const { forwardRef } = this.props;
      return createElement(Comp, {
        ...this.props,
        ref: forwardRef,
      });
    }
  }

  return forwardRef((props, ref) => {
    return createElement(compWrapper, { ...props, forwardRef: ref });
  });
}
