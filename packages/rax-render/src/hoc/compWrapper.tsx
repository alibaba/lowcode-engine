// @ts-nocheck

import { createElement, Component } from 'rax';

export default function (Comp) {
  return class CompWrapper extends Component {
    render() {
      return createElement(Comp, {
        ...this.props,
      });
    }
  };
}
