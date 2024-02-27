import { cloneEnumerableProperty } from '../../src/clone-enumerable-property';

describe('cloneEnumerableProperty', () => {
  test('should clone enumerable properties from origin to target', () => {
    // Arrange
    const target = {};
    const origin = { prop1: 1, prop2: 'hello', prop3: true };

    // Act
    const result = cloneEnumerableProperty(target, origin);

    // Assert
    expect(result).toBe(target);
    expect(result).toEqual(origin);
  });

  test('should exclude properties specified in excludePropertyNames', () => {
    // Arrange
    const target = {};
    const origin = { prop1: 1, prop2: 'hello', prop3: true };
    const excludePropertyNames = ['prop2'];

    // Act
    const result = cloneEnumerableProperty(target, origin, excludePropertyNames);

    // Assert
    expect(result).toBe(target);
    expect(result).toEqual({ prop1: 1, prop3: true });
  });
});