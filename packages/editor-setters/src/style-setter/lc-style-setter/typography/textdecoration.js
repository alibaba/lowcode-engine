import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ChoiceControl from '@ali/ve-choice-control';
import Icons from '@ali/ve-icons';
import utils from '../utils';
const decorations = [{
  title: <Icons name="style.none" size="10px" />,
  value: 'none',
}, {
  title: <Icons name="style.underline" size="10px" />,
  value: 'underline',
}, {
  title: <Icons name="style.line-through" size="10px" />,
  value: 'line-through',
}];

class TextDecoration extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleTextDecorationSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setTextDecoration(align) {
    utils.setPropertyValue(this.props, 'text-decoration', align);
  }

  render() {
    const className = classNames('vs-style-text-decoration', this.props.className);
    const decoration = utils.getPropertyValue(this.props, 'text-decoration').value;

    return (
      <ChoiceControl
        className={className}
        options={decorations}
        value={decoration}
        onChange={(value) => this.setTextDecoration(value)}
      />
    );
  }
}

export default TextDecoration;
