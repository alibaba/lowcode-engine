import _extends from "@babel/runtime/helpers/extends";
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
import HOCBackgroundProps from '../utils/HOCBackgroundProps';
import HOCFlexLayoutProps from '../utils/HOCFlexLayoutProps';

var AIMakeBlank =
/*#__PURE__*/
function (_Component) {
  _inherits(AIMakeBlank, _Component);

  function AIMakeBlank() {
    _classCallCheck(this, AIMakeBlank);

    return _possibleConstructorReturn(this, _getPrototypeOf(AIMakeBlank).apply(this, arguments));
  }

  _createClass(AIMakeBlank, [{
    key: "render",
    value: function render() {
      var merged = {};
      var _this$props = this.props,
          children = _this$props.children,
          styleBoxModel = _this$props.styleBoxModel,
          styleLayout = _this$props.styleLayout,
          styleBackground = _this$props.styleBackground,
          styleFlexLayout = _this$props.styleFlexLayout,
          style = _this$props.style,
          id = _this$props.id;
      var styles = { ...styleBoxModel,
        ...styleLayout,
        ...styleBackground,
        ...styleFlexLayout,
        ...style
      };

      if (id) {
        merged.id = id;
      }

      return React.createElement("div", _extends({
        style: styles
      }, merged), children);
    }
  }]);

  return AIMakeBlank;
}(Component);

_defineProperty(AIMakeBlank, "propTypes", {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  styleBoxModel: PropTypes.object.isRequired,
  styleLayout: PropTypes.object.isRequired,
  styleBackground: PropTypes.object.isRequired,
  styleFlexLayout: PropTypes.object.isRequired,
  style: PropTypes.object,
  id: PropTypes.string
});

_defineProperty(AIMakeBlank, "defaultProps", {
  children: [],
  style: {},
  id: ''
});

export default HOCBoxModelProps(HOCLayoutProps(HOCBackgroundProps(HOCFlexLayoutProps(AIMakeBlank))));