import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * (HOC)注入背景相关属性配置
 * 包含 'backgroundColor'
 * @param {*} WrappedComponent
 */
const HOCBackgroundProps = (WrappedComponent) => {
  const PROPS = {
    backgroundColor: 'backgroundColor',
  };
  return class extends Component {
    static propTypes = {
      backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    static defaultProps = {
      backgroundColor: false,
    };

    parseStyle = (args) => {
      const style = {};
      Object.keys(PROPS).forEach((item) => {
        // if props isn't false
        if (!args[item]) return;
        style[PROPS[item]] = args[item];
      });
      return style;
    };

    render() {
      const { backgroundColor, ...otherProps } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          styleBackground={this.parseStyle(this.props)}
        />
      );
    }
  };
};

export default HOCBackgroundProps;
