import { createElement, Component, forwardRef } from 'rax';

export default function (Comp) {
  class compWrapper extends Component {
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
