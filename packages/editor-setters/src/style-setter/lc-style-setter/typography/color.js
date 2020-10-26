import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ColorControl from '@ali/ve-color-control';
import utils from '../utils';
class Color extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleFontColorSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setColor(color) {
    utils.setPropertyValue(this.props, 'color', color);
  }

  render() {
    const className = classNames('vs-style-font-color', this.props.className);
    const { current, inherit } = utils.getPropertyValue(this.props, 'color');

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
