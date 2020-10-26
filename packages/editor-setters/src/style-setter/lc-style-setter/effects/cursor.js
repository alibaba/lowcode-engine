import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import SelectControl from '@ali/ve-select-control';
import Icons from '@ali/ve-icons';
import utils from '../utils';
const CURSOR_TYPE = ['default', 'pointer'];

class Cursor extends Component {
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
    const className = classNames('vs-style-cursor', this.props.className);
    const cursor = utils.getPropertyValue(this.props, 'cursor');
    const options = CURSOR_TYPE.map((item, index) => ({
      text: <div key={index}><Icons name={`style.cursor-${item}`} size="small" />{item}</div>,
      value: item,
    }));
    return (
      <SelectControl
        className={className}
        value={cursor.value}
        options={options}
        onChange={(val) => utils.setPropertyValue(this.props, 'cursor', val)}
        min={0}
        max={100}
        syncTargetWidth
      />
    );
  }
}

export default Cursor;
