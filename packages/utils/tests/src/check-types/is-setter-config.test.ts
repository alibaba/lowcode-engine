import { isSetterConfig } from '../../../src/check-types/is-setter-config';

describe('isSetterConfig', () => {
  test('should return true for valid setter config', () => {
    const config = {
      componentName: 'MyComponent',
      // Add other required properties here
    };

    expect(isSetterConfig(config)).toBe(true);
  });

  test('should return false for invalid setter config', () => {
    const config = {
      // Missing componentName property
    };

    expect(isSetterConfig(config)).toBe(false);
    expect(isSetterConfig(null)).toBe(false);
    expect(isSetterConfig(undefined)).toBe(false);
    expect(isSetterConfig(0)).toBe(false);
    expect(isSetterConfig(2)).toBe(false);
  });

  // Add more test cases for different scenarios you want to cover
});
