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
import classNames from 'classnames';
import createFromIconfont from './IconFont';

var AIMakeIcon =
/*#__PURE__*/
function (_Component) {
  _inherits(AIMakeIcon, _Component);

  function AIMakeIcon() {
    _classCallCheck(this, AIMakeIcon);

    return _possibleConstructorReturn(this, _getPrototypeOf(AIMakeIcon).apply(this, arguments));
  }

  _createClass(AIMakeIcon, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          iconClassName = _this$props.iconClassName,
          children = _this$props.children,
          styleBoxModel = _this$props.styleBoxModel,
          styleText = _this$props.styleText,
          styleBackground = _this$props.styleBackground,
          style = _this$props.style,
          otherProps = _objectWithoutProperties(_this$props, ["className", "iconClassName", "children", "styleBoxModel", "styleText", "styleBackground", "style"]);

      var styles = { ...styleBoxModel,
        ...styleText,
        ...styleBackground,
        ...style
      };
      return React.createElement("i", _extends({}, otherProps, {
        className: classNames(className, iconClassName),
        style: styles
      }), children);
    }
  }]);

  return AIMakeIcon;
}(Component);

_defineProperty(AIMakeIcon, "propTypes", {
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  styleBoxModel: PropTypes.object.isRequired,
  styleText: PropTypes.object.isRequired,
  styleBackground: PropTypes.object.isRequired,
  style: PropTypes.object
});

_defineProperty(AIMakeIcon, "defaultProps", {
  className: '',
  iconClassName: 'iconfont',
  children: '',
  style: {}
});

AIMakeIcon.createFromIconfont = createFromIconfont;
export default AIMakeIcon;