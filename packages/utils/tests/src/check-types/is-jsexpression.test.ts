import { isJSExpression } from '../../../src/check-types/is-jsexpression';

describe('isJSExpression', () => {
  it('should return true if the input is a valid JSExpression object', () => {
    const validJSExpression = {
      type: 'JSExpression',
      extType: 'variable',
    };

    const result = isJSExpression(validJSExpression);

    expect(result).toBe(true);
  });

  it('should return false if the input is not a valid JSExpression object', () => {
    const invalidJSExpression = {
      type: 'JSExpression',
      extType: 'function',
    };

    const result = isJSExpression(invalidJSExpression);

    expect(result).toBe(false);
  });

  it('should return false if the input is null', () => {
    const result = isJSExpression(null);

    expect(result).toBe(false);
  });

  it('should return false if the input is undefined', () => {
    const result = isJSExpression(undefined);

    expect(result).toBe(false);
  });

  // 添加其他需要的测试
});
