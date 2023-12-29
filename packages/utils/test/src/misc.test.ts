import {
  isVariable,
  isUseI18NSetter,
  convertToI18NObject,
  isString,
  waitForThing,
  arrShallowEquals,
  isFromVC,
  executePendingFn,
  compatStage,
  invariant,
  isRegExp,
  shouldUseVariableSetter,
} from '../../src/misc';
import { IPublicModelComponentMeta } from '@alilc/lowcode-types';

describe('isVariable', () => {
  it('should return true for a variable object', () => {
    const variable = { type: 'variable', variable: 'foo', value: 'bar' };
    const result = isVariable(variable);
    expect(result).toBe(true);
  });

  it('should return false for non-variable objects', () => {
    const obj = { type: 'object' };
    const result = isVariable(obj);
    expect(result).toBe(false);
  });
});

describe('isUseI18NSetter', () => {
  it('should return true for a property with I18nSetter', () => {
    const prototype = { options: { configure: [{ name: 'propName', setter: { type: { displayName: 'I18nSetter' } } }] } };
    const propName = 'propName';
    const result = isUseI18NSetter(prototype, propName);
    expect(result).toBe(true);
  });

  it('should return false for a property without I18nSetter', () => {
    const prototype = { options: { configure: [{ name: 'propName', setter: { type: { displayName: 'OtherSetter' } } }] } };
    const propName = 'propName';
    const result = isUseI18NSetter(prototype, propName);
    expect(result).toBe(false);
  });
});

describe('convertToI18NObject', () => {
  it('should return the input if it is already an I18N object', () => {
    const i18nObject = { type: 'i18n', use: 'en', en: 'Hello' };
    const result = convertToI18NObject(i18nObject);
    expect(result).toEqual(i18nObject);
  });

  it('should convert a string to an I18N object', () => {
    const inputString = 'Hello';
    const result = convertToI18NObject(inputString);
    const expectedOutput = { type: 'i18n', use: 'zh-CN', 'zh-CN': inputString };
    expect(result).toEqual(expectedOutput);
  });
});

describe('isString', () => {
  it('should return true for a string', () => {
    const stringValue = 'Hello, world!';
    const result = isString(stringValue);
    expect(result).toBe(true);
  });

  it('should return true for an empty string', () => {
    const emptyString = '';
    const result = isString(emptyString);
    expect(result).toBe(true);
  });

  it('should return false for a number', () => {
    const numberValue = 42; // Not a string
    const result = isString(numberValue);
    expect(result).toBe(false);
  });

  it('should return false for an object', () => {
    const objectValue = { key: 'value' }; // Not a string
    const result = isString(objectValue);
    expect(result).toBe(false);
  });

  it('should return false for null', () => {
    const result = isString(null);
    expect(result).toBe(false);
  });

  it('should return false for undefined', () => {
    const undefinedValue = undefined;
    const result = isString(undefinedValue);
    expect(result).toBe(false);
  });

  it('should return false for a boolean', () => {
    const booleanValue = true; // Not a string
    const result = isString(booleanValue);
    expect(result).toBe(false);
  });
});

describe('waitForThing', () => {
  it('should resolve immediately if the thing is available', async () => {
    const obj = { prop: 'value' };
    const path = 'prop';
    const result = await waitForThing(obj, path);
    expect(result).toBe('value');
  });

  it('should resolve after a delay if the thing becomes available', async () => {
    const obj = { prop: undefined };
    const path = 'prop';
    const delay = 100; // Adjust the delay as needed
    setTimeout(() => {
      obj.prop = 'value';
    }, delay);

    const result = await waitForThing(obj, path);
    expect(result).toBe('value');
  });
});

describe('arrShallowEquals', () => {
  it('should return true for two empty arrays', () => {
    const arr1 = [];
    const arr2 = [];
    const result = arrShallowEquals(arr1, arr2);
    expect(result).toBe(true);
  });

  it('should return true for two arrays with the same elements in the same order', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    const result = arrShallowEquals(arr1, arr2);
    expect(result).toBe(true);
  });

  it('should return true for two arrays with the same elements in a different order', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [3, 2, 1];
    const result = arrShallowEquals(arr1, arr2);
    expect(result).toBe(true);
  });

  it('should return false for two arrays with different lengths', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2];
    const result = arrShallowEquals(arr1, arr2);
    expect(result).toBe(false);
  });

  it('should return false for one array and a non-array', () => {
    const arr1 = [1, 2, 3];
    const nonArray = 'not an array';
    const result = arrShallowEquals(arr1, nonArray);
    expect(result).toBe(false);
  });

  it('should return false for two arrays with different elements', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [3, 4, 5];
    const result = arrShallowEquals(arr1, arr2);
    expect(result).toBe(false);
  });

  it('should return true for arrays with duplicate elements', () => {
    const arr1 = [1, 2, 2, 3];
    const arr2 = [2, 3, 3, 1];
    const result = arrShallowEquals(arr1, arr2);
    expect(result).toBe(true);
  });
});

describe('isFromVC', () => {
  it('should return true when advanced configuration is present', () => {
    // Create a mock meta object with advanced configuration
    const meta: IPublicModelComponentMeta = {
      getMetadata: () => ({ configure: { advanced: true } }),
    };

    const result = isFromVC(meta);

    expect(result).toBe(true);
  });

  it('should return false when advanced configuration is not present', () => {
    // Create a mock meta object without advanced configuration
    const meta: IPublicModelComponentMeta = {
      getMetadata: () => ({ configure: { advanced: false } }),
    };

    const result = isFromVC(meta);

    expect(result).toBe(false);
  });

  it('should return false when meta is undefined', () => {
    const meta: IPublicModelComponentMeta | undefined = undefined;

    const result = isFromVC(meta);

    expect(result).toBe(false);
  });

  it('should return false when meta does not have configure information', () => {
    // Create a mock meta object without configure information
    const meta: IPublicModelComponentMeta = {
      getMetadata: () => ({}),
    };

    const result = isFromVC(meta);

    expect(result).toBe(false);
  });

  it('should return false when configure.advanced is not present', () => {
    // Create a mock meta object with incomplete configure information
    const meta: IPublicModelComponentMeta = {
      getMetadata: () => ({ configure: {} }),
    };

    const result = isFromVC(meta);

    expect(result).toBe(false);
  });
});

describe('executePendingFn', () => {
  it('should execute the provided function after the specified timeout', async () => {
    // Mock the function to execute
    const fn = jest.fn();

    // Call executePendingFn with the mocked function and a short timeout
    executePendingFn(fn, 100);

    // Ensure the function has not been called immediately
    expect(fn).not.toHaveBeenCalled();

    // Wait for the specified timeout
    await new Promise(resolve => setTimeout(resolve, 100));

    // Ensure the function has been called after the timeout
    expect(fn).toHaveBeenCalled();
  });

  it('should execute the provided function with a default timeout if not specified', async () => {
    // Mock the function to execute
    const fn = jest.fn();

    // Call executePendingFn with the mocked function without specifying a timeout
    executePendingFn(fn);

    // Ensure the function has not been called immediately
    expect(fn).not.toHaveBeenCalled();

    // Wait for the default timeout (2000 milliseconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Ensure the function has been called after the default timeout
    expect(fn).toHaveBeenCalled();
  });
});

describe('compatStage', () => {
  it('should convert a number to an enum stage', () => {
    const result = compatStage(3);
    expect(result).toBe('save');
  });

  it('should warn about the deprecated usage', () => {
    const warnSpy = jest.spyOn(console, 'warn');
    const result = compatStage(2);
    expect(result).toBe('serilize');
    expect(warnSpy).toHaveBeenCalledWith(
      'stage 直接指定为数字的使用方式已经过时，将在下一版本移除，请直接使用 IPublicEnumTransformStage.Render|Serilize|Save|Clone|Init|Upgrade'
    );
    warnSpy.mockRestore();
  });

  it('should return the enum stage if it is already an enum', () => {
    const result = compatStage('render');
    expect(result).toBe('render');
  });
});

describe('invariant', () => {
  it('should not throw an error if the check is true', () => {
    expect(() => invariant(true, 'Test invariant', 'thing')).not.toThrow();
  });

  it('should throw an error if the check is false', () => {
    expect(() => invariant(false, 'Test invariant', 'thing')).toThrowError(
      "Invariant failed: Test invariant in 'thing'"
    );
  });
});

describe('isRegExp', () => {
  it('should return true for a valid RegExp', () => {
    const regex = /test/;
    const result = isRegExp(regex);
    expect(result).toBe(true);
  });

  it('should return false for a non-RegExp object', () => {
    const nonRegExp = { test: /test/ };
    const result = isRegExp(nonRegExp);
    expect(result).toBe(false);
  });

  it('should return false for null', () => {
    const result = isRegExp(null);
    expect(result).toBe(false);
  });
});

it('shouldUseVariableSetter', () => {
  expect(shouldUseVariableSetter(false, true)).toBeFalsy();
  expect(shouldUseVariableSetter(true, true)).toBeTruthy();
  expect(shouldUseVariableSetter(true, false)).toBeTruthy();
  expect(shouldUseVariableSetter(undefined, false)).toBeFalsy();
  expect(shouldUseVariableSetter(undefined, true)).toBeTruthy();
});