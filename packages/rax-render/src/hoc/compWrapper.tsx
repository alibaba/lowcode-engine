// @ts-nocheck

import { createElement, Component } from 'rax';

export default function (Comp) {
  return class CompWrapper extends Component {
    constructor(props, context) {
      super(props, context);
    }

    render() {
      return createElement(Comp, {
        ...this.props,
      });
    }
  }
}
