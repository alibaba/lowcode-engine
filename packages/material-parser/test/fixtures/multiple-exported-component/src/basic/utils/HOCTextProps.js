import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * (HOC)注入文本相关属性配置
 * 包含 'fontSize', 'fontWeight', 'color'
 * @param {*} WrappedComponent
 */
const HOCTextProps = (WrappedComponent) => {
  const PROPS = {
    fontSize: 'fontSize',
    fontWeight: 'fontWeight',
    color: 'color',
  };
  return class extends Component {
    static propTypes = {
      fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      color: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    static defaultProps = {
      fontSize: false,
      fontWeight: false,
      color: false,
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
      const {
        fontSize, fontWeight, color, ...otherProps
      } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          styleText={this.parseStyle(this.props)}
        />
      );
    }
  };
};

export default HOCTextProps;
