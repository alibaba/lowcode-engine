import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ChoiceControl from '@ali/ve-choice-control';
import Icons from '@ali/ve-icons';
import utils from '../utils';
const repeats = [{
  title: <Icons name="style.repeat-a" size="12px" />,
  value: 'repeat',
}, {
  title: <Icons name="style.repeat-x" size="12px" />,
  value: 'repeat-x',
}, {
  title: <Icons name="style.repeat-y" size="12px" />,
  value: 'repeat-y',
}, {
  title: <Icons name="style.no" size="12px" />,
  value: 'no-repeat',
}];

class Repeat extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleBackgrounRepeatSetter';

  setRepeat(repeat) {
    utils.setBackground(this.props, 'background-repeat', repeat);
  }

  render() {
    const className = classNames('vs-style-background-repeat', this.props.className);
    const repeat = utils.getBackground(this.props, 'background-repeat').value;

    return (
      <ChoiceControl
        className={className}
        value={repeat}
        options={repeats}
        onChange={(value) => this.setRepeat(value)}
      />
    );
  }
}

export default Repeat;
