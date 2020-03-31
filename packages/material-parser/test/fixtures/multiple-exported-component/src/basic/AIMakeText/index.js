import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HOCBoxModelProps from '../utils/HOCBoxModelProps';
import HOCTextProps from '../utils/HOCTextProps';
import HOCLayoutProps from '../utils/HOCLayoutProps';
import HOCBackgroundProps from '../utils/HOCBackgroundProps';

class AIMakeText extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    type: PropTypes.string,
    styleBoxModel: PropTypes.object.isRequired,
    styleText: PropTypes.object.isRequired,
    styleLayout: PropTypes.object.isRequired,
    styleBackground: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    children: '',
    type: '', // paragraph || label
    style: {},
  };

  generateComponentType = (componentType) => {
    const componentNameMap = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      paragraph: 'p',
      label: 'label',
    };
    return componentNameMap[componentType] || 'div';
  };

  render() {
    const {
      children,
      type,
      styleBoxModel,
      styleText,
      styleLayout,
      styleBackground,
      style,
    } = this.props;
    const styles = {
      ...styleBoxModel,
      ...styleText,
      ...styleLayout,
      ...styleBackground,
      ...style,
    };
    const Comp = this.generateComponentType(type);
    const labelStyle = Comp === 'label' ? { display: 'inline-block' } : {};
    return (
      <Comp className="AIMakeText" style={Object.assign(labelStyle, styles)}>
        {[children]}
      </Comp>
    );
  }
}

export default HOCBoxModelProps(
  HOCTextProps(HOCLayoutProps(HOCBackgroundProps(AIMakeText))),
);
