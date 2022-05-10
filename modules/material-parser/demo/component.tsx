/* eslint-disable react/forbid-prop-types,react/no-unused-prop-types */
import React from 'react';

import './main.scss';

interface DemoProps {
  optionalArray?: [],
  optionalBool: boolean,
  optionalFunc: Function,
  optionalNumber: number,
  optionalObject: object,
  optionalString: string,
  optionalSymbol: symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: React.ReactNode,

  // A React element (ie. <MyComponent />).
  optionalElement: React.ReactElement,

  // A React element type (ie. MyComponent).
  optionalElementType: React.ElementType,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: React.ReactInstance,

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: 'News'|'Photos',

  // An object that could be one of many types
  optionalUnion: string|number|React.ReactInstance,

  // An array of a certain type
  optionalArrayOf: number[],

  // An object with property values of a certain type
  optionalObjectOf: Record<number, any>,

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
}

const Demo = (props: DemoProps) => {
  return <div> Test </div>;
}

Demo.defaultProps = {
  optionalString: 'optionalString'
};

export default Demo;
