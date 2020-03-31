import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HOCBoxModelProps from '../utils/HOCBoxModelProps';
import HOCLayoutProps from '../utils/HOCLayoutProps';

const AIMakePlaceholder =
/* #__PURE__ */
function (_Component) {
  _inherits(AIMakePlaceholder, _Component);

  function AIMakePlaceholder() {
    _classCallCheck(this, AIMakePlaceholder);

    return _possibleConstructorReturn(this, _getPrototypeOf(AIMakePlaceholder).apply(this, arguments));
  }

  _createClass(AIMakePlaceholder, [{
    key: "render",
    value: function render() {
      const _this$props = this.props;
          const children = _this$props.children;
          const styleBoxModel = _this$props.styleBoxModel;
          const styleLayout = _this$props.styleLayout;
          const style = _this$props.style;
      const styles = { ...styleBoxModel,
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
      return React.createElement("div", {
        style: placeholderStyle,
      }, children);
    },
  }]);

  return AIMakePlaceholder;
}(Component);

_defineProperty(AIMakePlaceholder, "propTypes", {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  styleBoxModel: PropTypes.object.isRequired,
  styleLayout: PropTypes.object.isRequired,
  style: PropTypes.object,
});

_defineProperty(AIMakePlaceholder, "defaultProps", {
  children: '',
  style: {},
});

export default HOCBoxModelProps(HOCLayoutProps(AIMakePlaceholder));