import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import PropTypes from 'prop-types';

var parseJoin = function (value) {
  return value.join(' ');
};
/**
 * (HOC)注入盒子模型相关属性配置
 * 包含 'display', 'margin', 'border', 'padding', 'width', 'height', 'borderRadius'
 * @param {*} WrappedComponent
 */


var HOCBoxModelProps = function (WrappedComponent) {
  var _class, _temp;

  var PROPS = {
    display: 'display',
    margin: 'margin',
    border: 'border',
    padding: 'padding',
    width: 'width',
    height: 'height',
    borderRadius: 'borderRadius'
  };
  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inherits(_class, _Component);

    function _class() {
      var _this;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
        _args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, ..._args));

      _defineProperty(_assertThisInitialized(_this), "parseStyle", function (args) {
        var style = {};
        Object.keys(PROPS).forEach(function (item) {
          // if props isn't false
          if (!args[item]) return;
          style[PROPS[item]] = Array.isArray(args[item]) ? parseJoin(args[item]) : args[item];
        });
        return style;
      });

      return _this;
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            display = _this$props.display,
            margin = _this$props.margin,
            border = _this$props.border,
            padding = _this$props.padding,
            width = _this$props.width,
            height = _this$props.height,
            borderRadius = _this$props.borderRadius,
            otherProps = _objectWithoutProperties(_this$props, ["display", "margin", "border", "padding", "width", "height", "borderRadius"]);

        return React.createElement(WrappedComponent, _extends({}, otherProps, {
          styleBoxModel: this.parseStyle(this.props)
        }));
      }
    }]);

    return _class;
  }(Component), _defineProperty(_class, "propTypes", {
    display: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    margin: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    border: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    padding: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  }), _defineProperty(_class, "defaultProps", {
    display: false,
    margin: false,
    border: false,
    padding: false,
    width: false,
    height: false,
    borderRadius: false
  }), _temp;
};

export default HOCBoxModelProps;