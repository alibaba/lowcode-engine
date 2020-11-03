import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import NumberControl from '@ali/ve-number-control';
import utils from '../utils';
function getRectSize(node, field) {
  const nativeNode = node;
  if (!nativeNode) return 0;
  return nativeNode.getBoundingClientRect()[field];
}

function getPercent(node, field) {
  const nativeNode = node;
  if (!nativeNode) return 100;
  const parentNode = nativeNode.parentNode;
  if (!parentNode) return 100;
  const s = nativeNode.getBoundingClientRect()[field];
  const p = parentNode.getBoundingClientRect()[field];
  return (s / p * 100).toFixed(0);
}

class Size extends Component {
  static propTypes = {
    prop: PropTypes.object,
    field: PropTypes.string,
    className: PropTypes.string,
  };

  static displayName = 'StyleLayoutSizeSetter';

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-layout-size', this.props.className);
    const { field, node } = this.props;
    const { current, inherit } = utils.getPropertyValue(this.props, field);

    return (
      <NumberControl
        className={className}
        placeholder={inherit}
        value={current}
        onChange={(val) => utils.setPropertyValue(this.props, field, val)}
        min={0}
        compute={() => `${getRectSize(node, field)}px`}
        units={[{
          type: 'px',
          cast(v, validNumber) {
            if (v === 'auto') {
              v = getRectSize(node, field);
            } else if (!validNumber) {
              v = '0';
            }
            return `${v}px`;
          },
          list: true,
        }, {
          type: '%',
          list: true,
          cast(v, validNumber) {
            if (v === 'auto') {
              return '100%';
            }
            v = getPercent(node, field) || '100';
            return `${v}%`;
          },
        }, {
          type: 'auto',
          preset: true,
          list: true,
        }, 'em', 'rem', 'pt', 'ex', 'ch', 'vh', 'vw', 'vmin', 'vmax', 'mm', 'q', 'cm', 'in', 'pc']}
      />
    );
  }
}

export default Size;
