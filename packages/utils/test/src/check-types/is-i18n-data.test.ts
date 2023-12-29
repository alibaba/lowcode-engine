import { isI18nData } from '../../../src/check-types/is-i18n-data';
import { IPublicTypeI18nData } from "@alilc/lowcode-types";

describe('isI18nData', () => {
  it('should return true for valid i18n data', () => {
    const i18nData: IPublicTypeI18nData = {
      type: 'i18n',
      // add any other required properties here
    };

    expect(isI18nData(i18nData)).toBe(true);
  });

  it('should return false for invalid i18n data', () => {
    const invalidData = {
      type: 'some-other-type',
      // add any other properties here
    };

    expect(isI18nData(invalidData)).toBe(false);
  });

  it('should return false for undefined or null', () => {
    expect(isI18nData(undefined)).toBe(false);
    expect(isI18nData(null)).toBe(false);
  });
});
