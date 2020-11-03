import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ChoiceControl from '@ali/ve-choice-control';
import Icons from '@ali/ve-icons';
import utils from '../utils';
class Style extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleFontStyleSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-font-style', this.props.className);
    let style = utils.getFont(this.props, 'font-style').value;
    if (style === 'oblique') {
      style = 'italic';
    }
    const options = [{
      title: <Icons name="style.normal" size="12px" />,
      value: 'normal',
    }, {
      title: <Icons name="style.italic" size="12px" />,
      value: 'italic',
    }];

    return (
      <ChoiceControl
        className={className}
        options={options}
        value={style}
        onChange={(value) => utils.setFont(this.props, 'font-style', value)}
      />
    );
  }
}

export default Style;
