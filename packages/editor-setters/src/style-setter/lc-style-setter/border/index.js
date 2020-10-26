import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import BorderStyle from './border';
import BorderRadius from './radius';
import utils from '../utils';
class Border extends Component {

  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  }

  static displayName = 'StyleBorderSetter';
  static transducer = utils.transducer;

  // shouldComponentUpdate() {
  //   return false;
  // }


  render() {
    const className = classNames('vs-style-border', this.props.className);

    return (
      <div className={className}>
        <BorderStyle {...this.props} />
        <BorderRadius {...this.props} />
      </div>
    );
  }
}

export default Border;
