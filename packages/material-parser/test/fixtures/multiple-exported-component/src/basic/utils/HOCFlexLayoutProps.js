import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * (HOC)注入flex布局相关属性配置
 * 包含 'alignItems', 'justifyContent', 'flexDirection'
 * @param {*} WrappedComponent
 */
const HOCFlexLayoutProps = (WrappedComponent) => {
  const PROPS = {
    alignItems: 'alignItems',
    justifyContent: 'justifyContent',
    flexDirection: 'flexDirection',
    flexWrap: 'flexWrap',
  };
  return class extends Component {
    static propTypes = {
      alignItems: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      justifyContent: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      flexDirection: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      flexWrap: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    static defaultProps = {
      alignItems: false,
      justifyContent: false,
      flexDirection: false,
      flexWrap: false,
    };

    parseStyle = (args) => {
      const style = {};
      if (args.style && args.style.display === 'flex') {
        Object.keys(PROPS).forEach((item) => {
          // if props isn't false
          if (!args[item]) return;
          style[PROPS[item]] = args[item];
        });
      }
      return style;
    };

    render() {
      const {
        alignItems,
        justifyContent,
        flexDirection,
        flexWrap,
        ...otherProps
      } = this.props;
      return (
        <WrappedComponent
          {...otherProps}
          styleFlexLayout={this.parseStyle(this.props)}
        />
      );
    }
  };
};

export default HOCFlexLayoutProps;
