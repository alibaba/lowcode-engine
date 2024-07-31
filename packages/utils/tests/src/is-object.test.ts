import { isObject, isI18NObject } from '../../src/is-object';

describe('isObject', () => {
  it('should return true for an object', () => {
    const obj = { key: 'value' };
    const result = isObject(obj);
    expect(result).toBe(true);
  });

  it('should return false for null', () => {
    const result = isObject(null);
    expect(result).toBe(false);
  });

  it('should return false for a non-object value', () => {
    const value = 42; // Not an object
    const result = isObject(value);
    expect(result).toBe(false);
  });
});

describe('isI18NObject', () => {
  it('should return true for an I18N object', () => {
    const i18nObject = { type: 'i18n', data: 'some data' };
    const result = isI18NObject(i18nObject);
    expect(result).toBe(true);
  });

  it('should return false for a non-I18N object', () => {
    const nonI18nObject = { type: 'other', data: 'some data' };
    const result = isI18NObject(nonI18nObject);
    expect(result).toBe(false);
  });

  it('should return false for null', () => {
    const result = isI18NObject(null);
    expect(result).toBe(false);
  });

  it('should return false for a non-object value', () => {
    const value = 42; // Not an object
    const result = isI18NObject(value);
    expect(result).toBe(false);
  });
});
