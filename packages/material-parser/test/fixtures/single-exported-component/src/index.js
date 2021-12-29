/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';

import './main.scss';

const a = 1, Demo = (props) => {
  return <div> Test </div>;
}

Demo.staticMethod = () => {
  console.log('static method');
}

Demo.propTypes = {
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  /**
   * desc
   * @param {string} title - The title of the book.
   * @param {string} author - The author of the book.
   * @returns {any}
   */
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
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Demo),
  ]),

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

Demo.defaultProps = {};

export default Demo;
