import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HOCBoxModelProps from '../utils/HOCBoxModelProps';
import HOCTextProps from '../utils/HOCTextProps';
import HOCLayoutProps from '../utils/HOCLayoutProps';
import HOCBackgroundProps from '../utils/HOCBackgroundProps';

const AIMakeLink =
/* #__PURE__ */
function (_Component) {
  _inherits(AIMakeLink, _Component);

  function AIMakeLink() {
    _classCallCheck(this, AIMakeLink);

    return _possibleConstructorReturn(this, _getPrototypeOf(AIMakeLink).apply(this, arguments));
  }

  _createClass(AIMakeLink, [{
    key: "render",
    value: function render() {
      const _this$props = this.props;
          const children = _this$props.children;
          const styleBoxModel = _this$props.styleBoxModel;
          const styleText = _this$props.styleText;
          const styleLayout = _this$props.styleLayout;
          const styleBackground = _this$props.styleBackground;
          const style = _this$props.style;
          const otherProps = _objectWithoutProperties(_this$props, ["children", "styleBoxModel", "styleText", "styleLayout", "styleBackground", "style"]);

      const styles = { ...styleBoxModel,
        ...styleText,
        ...styleLayout,
        ...styleBackground,
        ...style,
      };

      if (typeof children !== 'string') {
        styles.display = 'inline-block';
      }

      return React.createElement("a", _extends({}, otherProps, {
        style: styles,
      }), [children]);
    },
  }]);

  return AIMakeLink;
}(Component);

_defineProperty(AIMakeLink, "propTypes", {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  styleBoxModel: PropTypes.object.isRequired,
  styleText: PropTypes.object.isRequired,
  styleLayout: PropTypes.object.isRequired,
  styleBackground: PropTypes.object.isRequired,
  style: PropTypes.object,
});

_defineProperty(AIMakeLink, "defaultProps", {
  children: '',
  style: {},
});

export default HOCBoxModelProps(HOCTextProps(HOCLayoutProps(HOCBackgroundProps(AIMakeLink))));