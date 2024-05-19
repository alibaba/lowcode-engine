import { isBasicPropType } from '../../../src';

describe('test isBasicPropType ', () => {
  it('should work', () => {
    expect(isBasicPropType(null)).toBeFalsy();
    expect(isBasicPropType(undefined)).toBeFalsy();
    expect(isBasicPropType({})).toBeFalsy();
    expect(isBasicPropType({ type: 'any other type' })).toBeFalsy();
    expect(isBasicPropType('string')).toBeTruthy();
  });
});