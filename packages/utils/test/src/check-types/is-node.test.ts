import { isNode } from '../../../src/check-types/is-node';

describe('isNode', () => {
  it('should return true for a valid node', () => {
    const node = { isNode: true };
    expect(isNode(node)).toBeTruthy();
  });

  it('should return false for an invalid node', () => {
    const node = { isNode: false };
    expect(isNode(node)).toBeFalsy();
  });

  it('should return false for an undefined node', () => {
    expect(isNode(undefined)).toBeFalsy();
  });

  // Add more test cases if needed
});
