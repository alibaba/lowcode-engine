import { createElement, render, useState } from 'rax';
import React, { PureComponent } from 'react';
import DriverUniversal from 'driver-universal';
import { Engine } from '@ali/iceluna-rax';
import findDOMNode from 'rax-find-dom-node';

let updateRax = () => {};

export default class Rax extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const RaxEngine = () => {
      const [config, setConfig] = useState(this.props);
      updateRax = setConfig;
      return createElement(Engine, {
        ...config,
      });
    };
    render(createElement(RaxEngine), document.getElementById('luna-rax-container'), { driver: DriverUniversal });
  }
  componentDidUpdate() {
    updateRax(this.props);
  }

  render() {
    return <div id="luna-rax-container" />;
  }
}

Rax.findDOMNode = findDOMNode;
