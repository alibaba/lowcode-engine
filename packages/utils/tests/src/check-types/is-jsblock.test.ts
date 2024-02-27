import { isJSBlock } from '../../../src/check-types/is-jsblock';

describe('isJSBlock', () => {
  it('should return false if data is null or undefined', () => {
    expect(isJSBlock(null)).toBe(false);
    expect(isJSBlock(undefined)).toBe(false);
  });

  it('should return false if data is not an object', () => {
    expect(isJSBlock('JSBlock')).toBe(false);
    expect(isJSBlock(123)).toBe(false);
    expect(isJSBlock(true)).toBe(false);
  });

  it('should return false if data.type is not "JSBlock"', () => {
    expect(isJSBlock({ type: 'InvalidType' })).toBe(false);
  });

  it('should return true if data is an object and data.type is "JSBlock"', () => {
    expect(isJSBlock({ type: 'JSBlock' })).toBe(true);
  });
});
