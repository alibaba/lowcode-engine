import { isTitleConfig } from '../../../src/check-types/is-title-config';

describe('isTitleConfig', () => {
  it('should return true for valid config object', () => {
    const config = { title: 'My Title' };
    expect(isTitleConfig(config)).toBe(true);
  });

  it('should return false for invalid config object', () => {
    const config = { title: 'My Title', type: 'i18n' , i18nData: {} };
    expect(isTitleConfig(config)).toBe(false);
  });

  it('should return false for non-object input', () => {
    const config = 'invalid';
    expect(isTitleConfig(config)).toBe(false);
  });
});
