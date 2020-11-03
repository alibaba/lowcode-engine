import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import SelectControl from '@ali/ve-select-control';
import utils from '../utils';
const weights = [{
  text: '100 Thin',
  value: '100',
}, {
  text: '100 Extra Light',
  value: '200',
}, {
  text: '100 Light',
  value: '300',
}, {
  text: '400 Normal',
  value: '400',
}, {
  text: '500 Medium',
  value: '500',
}, {
  text: '600 Semi Bold',
  value: '600',
}, {
  text: '700 Bold',
  value: '700',
}, {
  text: '800 Extra Bold',
  value: '800',
}, {
  text: '900 Black',
  value: '900',
}, {
  text: 'Lighter',
  value: 'lighter',
}, {
  text: 'Bolder',
  value: 'bolder',
}];

class Weight extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleFontWeightSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setWeight(weight) {
    if (weight === '400') {
      weight = 'normal';
    } else if (weight === '700') {
      weight = 'bold';
    }
    utils.setFont(this.props, 'font-weight', weight);
  }

  render() {
    const className = classNames('vs-style-font-weight', this.props.className);
    let weight = utils.getFont(this.props, 'font-weight').value;

    if (weight === 'normal') {
      weight = '400';
    } else if (weight === 'bold') {
      weight = '700';
    }

    return (
      <SelectControl
        className={className}
        options={weights}
        value={weight}
        onChange={(value) => this.setWeight(value)}
      />
    );
  }
}

export default Weight;
