import { isRequiredPropType } from '../../../src';

describe('test isRequiredType', () => {
  it('should work', () => {
    expect(isRequiredPropType(null)).toBeFalsy();
    expect(isRequiredPropType(undefined)).toBeFalsy();
    expect(isRequiredPropType({})).toBeFalsy();
    expect(isRequiredPropType({ type: 'any other type' })).toBeFalsy();
    expect(isRequiredPropType('string')).toBeFalsy();
    expect(isRequiredPropType({ type: 'string' })).toBeTruthy();
    expect(isRequiredPropType({ type: 'string', isRequired: true })).toBeTruthy();
  });
})
