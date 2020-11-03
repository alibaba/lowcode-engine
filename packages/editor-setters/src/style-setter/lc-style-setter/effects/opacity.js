import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import NumberControl from '@ali/ve-number-control';
import utils from '../utils';
class Opacity extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleOpacitySetter';
  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-opacity', this.props.className);
    const opacity = utils.getPropertyValue(this.props, 'opacity');
    const getFloat = v => parseFloat(v).toFixed(2);
    const current = opacity.current ? `${parseInt(opacity.current * 100, 10)}%` : null;
    return (
      <NumberControl
        className={className}
        placeholder={`${getFloat(opacity.inherit) * 100}%`}
        value={current}
        onChange={(val) => {
          const value = (parseFloat((val.split('%')[0])) / 100).toFixed(2);
          utils.setPropertyValue(this.props, 'opacity', value);
        }}
        min={0}
        max={100}
        units={[{
          type: '%',
          list: true,
        }]}
      />
    );
  }
}

export default Opacity;
