import { createElement, Component } from 'rax';

export default function (Comp) {
  class compWrapper extends Component {
    constructor(props, context) {
      super(props, context);
    }

    render() {
      return createElement(Comp, {
        ...this.props,
      });
    }
  }

  return compWrapper;
}
