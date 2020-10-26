import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import NumberControl from '@ali/ve-number-control';
import utils from '../utils';
class LineHeight extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleLineHeightSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-line-height', this.props.className);
    const { current, inherit } = utils.getFont(this.props, 'line-height');

    return (
      <NumberControl
        className={className}
        placeholder={inherit}
        value={current}
        onChange={(val) => utils.setFont(this.props, 'line-height', val)}
        min={0}
        units={[{
          type: '-',
          list: true,
          cast() {
            return '1-';
          },
        }, {
          type: 'px',
          list: true,
        }, {
          type: '%',
          list: true,
        }, {
          type: 'em',
          list: true,
        }, {
          type: 'normal',
          preset: true,
        }, 'rem', 'pt']}
      />
    );
  }
}

export default LineHeight;
