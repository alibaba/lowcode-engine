import { isActionContentObject } from '../../../src/check-types/is-action-content-object';

describe('isActionContentObject', () => {
  test('should return true for an object', () => {
    const obj = { prop: 'value' };
    expect(isActionContentObject(obj)).toBe(true);
  });

  test('should return false for a non-object', () => {
    expect(isActionContentObject('not an object')).toBe(false);
    expect(isActionContentObject(123)).toBe(false);
    expect(isActionContentObject(null)).toBe(false);
    expect(isActionContentObject(undefined)).toBe(false);
  });

  test('should return false for an empty object', () => {
    const obj = {};
    expect(isActionContentObject(obj)).toBe(true);
  });
});
