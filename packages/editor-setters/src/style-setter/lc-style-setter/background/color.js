import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ColorControl from '@ali/ve-color-control';
import utils from '../utils';
class Color extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleBackgrounColorSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setColor(color) {
    utils.setBackground(this.props, 'background-color', color);
  }

  render() {
    const className = classNames('vs-style-background-color', this.props.className);
    const { current, inherit } = utils.getBackground(this.props, 'background-color');

    return (
      <ColorControl
        className={className}
        value={current}
        placeholder={inherit}
        onChange={(value) => this.setColor(value)}
      />
    );
  }
}

export default Color;
