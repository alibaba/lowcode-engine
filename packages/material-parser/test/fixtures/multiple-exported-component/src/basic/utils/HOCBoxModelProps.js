import React, { Component } from 'react';
import PropTypes from 'prop-types';

const parseJoin = value => value.join(' ');

/**
 * (HOC)注入盒子模型相关属性配置
 * 包含 'display', 'margin', 'border', 'padding', 'width', 'height', 'borderRadius'
 * @param {*} WrappedComponent
 */
const HOCBoxModelProps = (WrappedComponent) => {
  const PROPS = {
    display: 'display',
    margin: 'margin',
    border: 'border',
    padding: 'padding',
    width: 'width',
    height: 'height',
    borderRadius: 'borderRadius',
  };
  return class extends Component {
    static propTypes = {
      display: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      margin: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
      border: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
      padding: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      height: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    static defaultProps = {
      display: false,
      margin: false,
      border: false,
      padding: false,
      width: false,
      height: false,
      borderRadius: false,
    };

    parseStyle = (args) => {
      const style = {};
      Object.keys(PROPS).forEach((item) => {
        // if props isn't false
        if (!args[item]) return;
        style[PROPS[item]] = Array.isArray(args[item])
          ? parseJoin(args[item])
          : args[item];
      });
      return style;
    };

    render() {
      const {
        display,
        margin,
        border,
        padding,
        width,
        height,
        borderRadius,
        ...otherProps
      } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          styleBoxModel={this.parseStyle(this.props)}
        />
      );
    }
  };
};

export default HOCBoxModelProps;
