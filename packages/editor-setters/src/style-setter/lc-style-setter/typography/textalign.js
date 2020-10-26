import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ChoiceControl from '@ali/ve-choice-control';
import Icons from '@ali/ve-icons';
import utils from '../utils';
const aligns = [{
  title: <Icons name="style.text-align-left" size="10px" />,
  value: 'left',
}, {
  title: <Icons name="style.text-align-center" size="10px" />,
  value: 'center',
}, {
  title: <Icons name="style.text-align-left" className="vs-style-reverse-v-h" size="10px" />,
  value: 'right',
}, {
  title: <Icons name="style.text-align-justify" size="10px" />,
  value: 'justify',
}];

class TextAlign extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleTextAlignSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setTextAlign(align) {
    utils.setPropertyValue(this.props, 'text-align', align);
  }

  render() {
    const className = classNames('vs-style-text-align', this.props.className);
    const align = utils.getPropertyValue(this.props, 'text-align').value;

    return (
      <ChoiceControl
        className={className}
        options={aligns}
        value={align}
        onChange={(value) => this.setTextAlign(value)}
      />
    );
  }
}

export default TextAlign;
