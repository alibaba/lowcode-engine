import { isProCodeComponentType } from '../../../src/check-types/is-procode-component-type';

describe('isProCodeComponentType', () => {
  it('should return true if the given desc object contains "package" property', () => {
    const desc = { package: 'packageName' };
    expect(isProCodeComponentType(desc)).toBe(true);
  });

  it('should return false if the given desc object does not contain "package" property', () => {
    const desc = { name: 'componentName' };
    expect(isProCodeComponentType(desc)).toBe(false);
  });
});
