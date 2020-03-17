import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * (HOC)注入布局相关属性配置
 * 包含 'align', 'lineHeight', 'verticalAlign'
 * @param {*} WrappedComponent
 */
const HOCLayoutProps = (WrappedComponent) => {
  const PROPS = {
    align: 'textAlign',
    lineHeight: 'lineHeight',
    verticalAlign: 'verticalAlign',
  };
  return class extends Component {
    static propTypes = {
      align: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      lineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      verticalAlign: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    static defaultProps = {
      align: false,
      lineHeight: false,
      verticalAlign: false,
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
        align, lineHeight, verticalAlign, ...otherProps
      } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          styleLayout={this.parseStyle(this.props)}
        />
      );
    }
  };
};

export default HOCLayoutProps;
