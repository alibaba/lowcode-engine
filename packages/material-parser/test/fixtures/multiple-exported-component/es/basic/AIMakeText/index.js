import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HOCBoxModelProps from '../utils/HOCBoxModelProps';
import HOCTextProps from '../utils/HOCTextProps';
import HOCLayoutProps from '../utils/HOCLayoutProps';
import HOCBackgroundProps from '../utils/HOCBackgroundProps';

const AIMakeText =
/* #__PURE__ */
function (_Component) {
  _inherits(AIMakeText, _Component);

  function AIMakeText() {
    let _this;

    _classCallCheck(this, AIMakeText);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AIMakeText).call(this, ...args));

    _defineProperty(_assertThisInitialized(_this), "generateComponentType", function (componentType) {
      const componentNameMap = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        paragraph: 'p',
        label: 'label',
      };
      return componentNameMap[componentType] || 'div';
    });

    return _this;
  }

  _createClass(AIMakeText, [{
    key: "render",
    value: function render() {
      const _this$props = this.props;
          const children = _this$props.children;
          const type = _this$props.type;
          const styleBoxModel = _this$props.styleBoxModel;
          const styleText = _this$props.styleText;
          const styleLayout = _this$props.styleLayout;
          const styleBackground = _this$props.styleBackground;
          const style = _this$props.style;
      const styles = { ...styleBoxModel,
        ...styleText,
        ...styleLayout,
        ...styleBackground,
        ...style,
      };
      const Comp = this.generateComponentType(type);
      const labelStyle = Comp === 'label' ? {
        display: 'inline-block',
      } : {};
      return React.createElement(Comp, {
        className: "AIMakeText",
        style: Object.assign(labelStyle, styles),
      }, [children]);
    },
  }]);

  return AIMakeText;
}(Component);

_defineProperty(AIMakeText, "propTypes", {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.string]),
  type: PropTypes.string,
  styleBoxModel: PropTypes.object.isRequired,
  styleText: PropTypes.object.isRequired,
  styleLayout: PropTypes.object.isRequired,
  styleBackground: PropTypes.object.isRequired,
  style: PropTypes.object,
});

_defineProperty(AIMakeText, "defaultProps", {
  children: '',
  type: '',
  // paragraph || label
  style: {},
});

export default HOCBoxModelProps(HOCTextProps(HOCLayoutProps(HOCBackgroundProps(AIMakeText))));