import { isNodeSchema } from '../../../src/check-types/is-node-schema';

describe('isNodeSchema', () => {
  // 测试正常情况
  it('should return true for valid IPublicTypeNodeSchema', () => {
    const validData = {
      componentName: 'Component',
      isNode: false,
    };
    expect(isNodeSchema(validData)).toBe(true);
  });

  // 测试 null 或 undefined
  it('should return false for null or undefined', () => {
    expect(isNodeSchema(null)).toBe(false);
    expect(isNodeSchema(undefined)).toBe(false);
  });

  // 测试没有componentName属性的情况
  it('should return false if componentName is missing', () => {
    const invalidData = {
      isNode: false,
    };
    expect(isNodeSchema(invalidData)).toBe(false);
  });

  // 测试isNode为true的情况
  it('should return false if isNode is true', () => {
    const invalidData = {
      componentName: 'Component',
      isNode: true,
    };
    expect(isNodeSchema(invalidData)).toBe(false);
  });

  // 测试其他数据类型的情况
  it('should return false for other data types', () => {
    expect(isNodeSchema('string')).toBe(false);
    expect(isNodeSchema(123)).toBe(false);
    expect(isNodeSchema([])).toBe(false);
    expect(isNodeSchema({})).toBe(false);
  });
});
