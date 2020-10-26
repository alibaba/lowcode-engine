import React, { Component, PropTypes } from 'react';
import Size from './size';
import utils from '../utils';
class Height extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleLayoutWidthSetter';

  static transducer = utils.transducer;

  render() {
    return <Size {...this.props} field="height" />;
  }
}

export default Height;
