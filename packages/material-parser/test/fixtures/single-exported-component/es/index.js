import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/* eslint-disable react/no-unused-prop-types */

/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import "./main.css";

const Demo =
/* #__PURE__ */
function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo() {
    _classCallCheck(this, Demo);

    return _possibleConstructorReturn(this, _getPrototypeOf(Demo).apply(this, arguments));
  }

  _createClass(Demo, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, " Test ");
    },
  }]);

  return Demo;
}(React.Component);

Demo.propTypes = {
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,
  // A React element (ie. <MyComponent />).
  optionalElement: PropTypes.element,
  // A React element type (ie. MyComponent).
  optionalElementType: PropTypes.elementType,
  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Demo),
  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),
  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Demo)]),
  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),
  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired,
  }),
  optionalObjectWithShape2: PropTypes.shape({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired,
  }).isRequired,
  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    optionalProperty: PropTypes.string,
    requiredProperty: PropTypes.number.isRequired,
  }),
  requiredFunc: PropTypes.func.isRequired,
  // A value of any data type
  requiredAny: PropTypes.any.isRequired,
};
Demo.defaultProps = {
  optionalNumber: 123,
};
export default Demo;