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
/**
 * (HOC)注入布局相关属性配置
 * 包含 'align', 'lineHeight', 'verticalAlign'
 * @param {*} WrappedComponent
 */

const HOCLayoutProps = function (WrappedComponent) {
  let _class; let _temp;

  const PROPS = {
    align: 'textAlign',
    lineHeight: 'lineHeight',
    verticalAlign: 'verticalAlign',
  };
  return _temp = _class =
  /* #__PURE__ */
  function (_Component) {
    _inherits(_class, _Component);

    function _class() {
      let _this;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
        _args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, ..._args));

      _defineProperty(_assertThisInitialized(_this), "parseStyle", function (args) {
        const style = {};
        Object.keys(PROPS).forEach(function (item) {
          // if props isn't false
          if (!args[item]) return;
          style[PROPS[item]] = args[item];
        });
        return style;
      });

      return _this;
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        const _this$props = this.props;
            const align = _this$props.align;
            const lineHeight = _this$props.lineHeight;
            const verticalAlign = _this$props.verticalAlign;
            const otherProps = _objectWithoutProperties(_this$props, ["align", "lineHeight", "verticalAlign"]);

        return React.createElement(WrappedComponent, _extends({}, otherProps, {
          styleLayout: this.parseStyle(this.props),
        }));
      },
    }]);

    return _class;
  }(Component), _defineProperty(_class, "propTypes", {
    align: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    lineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    verticalAlign: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }), _defineProperty(_class, "defaultProps", {
    align: false,
    lineHeight: false,
    verticalAlign: false,
  }), _temp;
};

export default HOCLayoutProps;