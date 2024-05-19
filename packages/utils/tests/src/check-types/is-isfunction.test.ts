import { isInnerJsFunction, isJSFunction } from '../../../src/check-types/is-isfunction';

describe('isInnerJsFunction', () => {
  test('should return true for valid input', () => {
    const data = {
      type: 'JSExpression',
      source: '',
      value: '',
      extType: 'function'
    };

    expect(isInnerJsFunction(data)).toBe(true);
  });

  test('should return false for invalid input', () => {
    const data = {
      type: 'JSExpression',
      source: '',
      value: '',
      extType: 'object'
    };

    expect(isInnerJsFunction(data)).toBe(false);
    expect(isInnerJsFunction(null)).toBe(false);
    expect(isInnerJsFunction(undefined)).toBe(false);
    expect(isInnerJsFunction(1)).toBe(false);
    expect(isInnerJsFunction(0)).toBe(false);
    expect(isInnerJsFunction('string')).toBe(false);
    expect(isInnerJsFunction('')).toBe(false);
  });
});

describe('isJSFunction', () => {
  test('should return true for valid input', () => {
    const data = {
      type: 'JSFunction',
    };

    expect(isJSFunction(data)).toBe(true);
  });

  test('should return true for inner js function', () => {
    const data = {
      type: 'JSExpression',
      source: '',
      value: '',
      extType: 'function'
    };

    expect(isJSFunction(data)).toBe(true);
  });

  test('should return false for invalid input', () => {
    expect(isJSFunction(null)).toBe(false);
    expect(isJSFunction(undefined)).toBe(false);
    expect(isJSFunction('string')).toBe(false);
    expect(isJSFunction('')).toBe(false);
    expect(isJSFunction(0)).toBe(false);
    expect(isJSFunction(2)).toBe(false);
  });
});
