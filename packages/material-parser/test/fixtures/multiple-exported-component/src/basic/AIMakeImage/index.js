import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HOCBoxModelProps from '../utils/HOCBoxModelProps';

class AIMakeImage extends Component {
  static propTypes = {
    styleBoxModel: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    const { styleBoxModel, style, ...otherProps } = this.props;
    const styles = {
      ...styleBoxModel,
      ...style,
    };
    return <img {...otherProps} style={styles} alt="AIMakeImage" />;
  }
}

export default HOCBoxModelProps(AIMakeImage);
