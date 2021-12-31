import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HOCBoxModelProps from '../utils/HOCBoxModelProps';
import HOCLayoutProps from '../utils/HOCLayoutProps';
import HOCBackgroundProps from '../utils/HOCBackgroundProps';
import HOCFlexLayoutProps from '../utils/HOCFlexLayoutProps';

class AIMakeBlank extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    styleBoxModel: PropTypes.object.isRequired,
    styleLayout: PropTypes.object.isRequired,
    styleBackground: PropTypes.object.isRequired,
    styleFlexLayout: PropTypes.object.isRequired,
    style: PropTypes.object,
    id: PropTypes.string,
  };

  static defaultProps = {
    children: [],
    style: {},
    id: '',
  };

  render() {
    const merged = {};
    const {
      children,
      styleBoxModel,
      styleLayout,
      styleBackground,
      styleFlexLayout,
      style,
      id,
    } = this.props;

    const styles = {
      ...styleBoxModel,
      ...styleLayout,
      ...styleBackground,
      ...styleFlexLayout,
      ...style,
    };
    if (id) {
      merged.id = id;
    }
    return (
      <div style={styles} {...merged}>
        {children}
      </div>
    );
  }
}

export default HOCBoxModelProps(
  HOCLayoutProps(HOCBackgroundProps(HOCFlexLayoutProps(AIMakeBlank))),
);
