import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HOCBoxModelProps from '../utils/HOCBoxModelProps';
import HOCLayoutProps from '../utils/HOCLayoutProps';

class AIMakePlaceholder extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    styleBoxModel: PropTypes.object.isRequired,
    styleLayout: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    children: '',
    style: {},
  };

  render() {
    const {
      children, styleBoxModel, styleLayout, style,
    } = this.props;
    const styles = {
      ...styleBoxModel,
      ...styleLayout,
      ...style,
    };
    const placeholderStyle = {
      display: 'inline-block',
      border: '1px dashed #aaa',
      lineHeight: styles.height,
      backgroundColor: '#F5E075',
      overflow: 'hidden',
      textAlign: 'center',
      ...styles,
    };
    return <div style={placeholderStyle}>{children}</div>;
  }
}

export default HOCBoxModelProps(HOCLayoutProps(AIMakePlaceholder));
