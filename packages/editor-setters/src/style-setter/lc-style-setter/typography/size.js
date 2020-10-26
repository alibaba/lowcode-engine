import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import NumberControl from '@ali/ve-number-control';
import utils from '../utils';
class Size extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleFontSizeSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-font-size', this.props.className);
    const { current, inherit } = utils.getFont(this.props, 'font-size');
    return (
      <NumberControl
        className={className}
        placeholder={inherit}
        value={current}
        onChange={(val) => utils.setFont(this.props, 'font-size', val)}
        min={0}
        units={[{
          type: 'px',
          list: true,
        }, {
          type: '%',
          list: true,
        }, {
          type: 'em',
          list: true,
        }, {
          type: 'xx-small',
          preset: true,
        }, {
          type: 'x-small',
          preset: true,
        }, {
          type: 'small',
          preset: true,
        }, {
          type: 'medium',
          preset: true,
        }, {
          type: 'large',
          preset: true,
        }, {
          type: 'x-large',
          preset: true,
        }, {
          type: 'xx-large',
          preset: true,
        }, {
          type: 'larger',
          preset: true,
        }, {
          type: 'smaller',
          preset: true,
        }, 'rem', 'pt']}
      />
    );
  }
}

export default Size;
