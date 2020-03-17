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

var AIMakeImage =
/*#__PURE__*/
function (_Component) {
  _inherits(AIMakeImage, _Component);

  function AIMakeImage() {
    _classCallCheck(this, AIMakeImage);

    return _possibleConstructorReturn(this, _getPrototypeOf(AIMakeImage).apply(this, arguments));
  }

  _createClass(AIMakeImage, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          styleBoxModel = _this$props.styleBoxModel,
          style = _this$props.style,
          otherProps = _objectWithoutProperties(_this$props, ["styleBoxModel", "style"]);

      var styles = { ...styleBoxModel,
        ...style
      };
      return React.createElement("img", _extends({}, otherProps, {
        style: styles,
        alt: "AIMakeImage"
      }));
    }
  }]);

  return AIMakeImage;
}(Component);

_defineProperty(AIMakeImage, "propTypes", {
  styleBoxModel: PropTypes.object.isRequired,
  style: PropTypes.object
});

_defineProperty(AIMakeImage, "defaultProps", {
  style: {}
});

export default HOCBoxModelProps(AIMakeImage);