import React from 'react';
import { createContent } from '../../src/create-content';

const MyComponent = () => {
  return <div>MyComponent</div>
}
describe('createContent', () => {
  test('should return the same content if it is a valid React element', () => {
    const content = <div>Hello</div>;
    const result = createContent(content);

    expect(result).toEqual(content);
  });

  test('should clone the element with props if props are provided', () => {
    const content = <div></div>;
    const props = { className: 'my-class' };
    const result = createContent(content, props);

    expect(result.props).toEqual(props);
  });

  test('should create an element with props if the content is a React component', () => {
    const content = MyComponent;
    const props = { className: 'my-class' };
    const result = createContent(content, props);

    expect(result.type).toEqual(content);
    expect(result.props).toEqual(props);
  });

  test('should return the content if it is not a React element or a React component', () => {
    const content = 'Hello';
    const result = createContent(content);

    expect(result).toEqual(content);
  });
});
