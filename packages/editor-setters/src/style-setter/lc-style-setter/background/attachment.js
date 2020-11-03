import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ChoiceControl from '@ali/ve-choice-control';
import Icons from '@ali/ve-icons';
import utils from '../utils';

const attchments = [{
  title: <Icons name="style.yes" size="12px" />,
  value: 'fixed',
}, {
  title: <Icons name="style.no" size="12px" />,
  value: 'scroll',
}];

class Attachment extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleBackgrounAttachmentSetter';

  setAttachment(attachment) {
    utils.setBackground(this.props, 'background-attachment', attachment);
  }

  render() {
    const className = classNames('vs-style-background-attachment', this.props.className);
    const attachment = utils.getBackground(this.props, 'background-attachment').value;

    return (
      <ChoiceControl
        className={className}
        value={attachment}
        options={attchments}
        onChange={(value) => this.setAttachment(value)}
      />
    );
  }
}

export default Attachment;
