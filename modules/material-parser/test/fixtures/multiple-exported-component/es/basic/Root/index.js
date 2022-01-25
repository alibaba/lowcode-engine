import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import PropTypes from 'prop-types';

const Root =
/* #__PURE__ */
function (_React$Component) {
  _inherits(Root, _React$Component);

  function Root() {
    _classCallCheck(this, Root);

    return _possibleConstructorReturn(this, _getPrototypeOf(Root).apply(this, arguments));
  }

  _createClass(Root, [{
    key: "render",
    value: function render() {
      const _this$props = this.props;
          const style = _this$props.style;
          const children = _this$props.children;
      const newStyle = Object.assign({}, Root.defaultProps.style, style);
      return React.createElement("div", {
        style: newStyle,
      }, children);
    },
  }]);

  return Root;
}(React.Component);

_defineProperty(Root, "propTypes", {
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
});

_defineProperty(Root, "defaultProps", {
  style: {
    padding: 0,
    backgroundColor: '#f0f2f5',
    minHeight: '100%',
  },
  children: null,
});

export default Root;