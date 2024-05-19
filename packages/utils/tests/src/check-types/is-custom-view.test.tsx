import React from 'react';
import { isCustomView } from '../../../src/check-types/is-custom-view';
import { IPublicTypeCustomView } from '@alilc/lowcode-types';

describe('isCustomView', () => {
  test('should return true when obj is a valid React element', () => {
    const obj: IPublicTypeCustomView = <div>Hello, World!</div>;
    expect(isCustomView(obj)).toBe(true);
  });

  test('should return true when obj is a valid React component', () => {
    const MyComponent: React.FC = () => <div>Hello, World!</div>;
    const obj: IPublicTypeCustomView = MyComponent;
    expect(isCustomView(obj)).toBe(true);
  });

  test('should return false when obj is null or undefined', () => {
    expect(isCustomView(null)).toBe(false);
    expect(isCustomView(undefined)).toBe(false);
  });

  test('should return false when obj is not a valid React element or component', () => {
    const obj: IPublicTypeCustomView = 'not a valid object';
    expect(isCustomView(obj)).toBe(false);
  });
});
