import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ChoiceControl from '@ali/ve-choice-control';
import Icons from '@ali/ve-icons';
import utils from '../utils';
class Display extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleLayoutDisplaySetter';

  render() {
    const display = utils.getPropertyValue(this.props, 'display').value;
    return (
      <ChoiceControl
        className="vs-style-layout-diplay"
        value={display}
        options={[{
          title: <Icons name="style.block" size="medium" />,
          value: 'block',
        }, {
          title: <Icons name="style.inline-block" size="medium" />,
          value: 'inline-block',
        }, {
          title: <Icons name="style.inline" size="medium" />,
          value: 'inline',
        }, {
          title: <Icons name="style.flex" size="medium" />,
          value: 'flex',
        },
        // {
        //   title: <Icons name="hidden" size="medium" />,
        //   value: 'none',
        // }
        ]}
        onChange={val => utils.setPropertyValue(this.props, 'display', val)}
      />
    );
  }
}

export default Display;
