import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HOCBoxModelProps from '../utils/HOCBoxModelProps';
import HOCTextProps from '../utils/HOCTextProps';
import HOCLayoutProps from '../utils/HOCLayoutProps';
import HOCBackgroundProps from '../utils/HOCBackgroundProps';

class AIMakeLink extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    styleBoxModel: PropTypes.object.isRequired,
    styleText: PropTypes.object.isRequired,
    styleLayout: PropTypes.object.isRequired,
    styleBackground: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    children: '',
    style: {},
  };

  render() {
    const {
      children,
      styleBoxModel,
      styleText,
      styleLayout,
      styleBackground,
      style,
      ...otherProps
    } = this.props;
    const styles = {
      ...styleBoxModel,
      ...styleText,
      ...styleLayout,
      ...styleBackground,
      ...style,
    };
    if (typeof children !== 'string') {
      styles.display = 'inline-block';
    }
    return (
      <a {...otherProps} style={styles}>
        {[children]}
      </a>
    );
  }
}

export default HOCBoxModelProps(
  HOCTextProps(HOCLayoutProps(HOCBackgroundProps(AIMakeLink))),
);
