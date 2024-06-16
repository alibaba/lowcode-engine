import { describe, it, expect } from 'vitest';
import { someValue, mapValue } from '../../src/utils/value';

describe('someValue', () => {
  it('should return false for non-plain objects or empty objects', () => {
    expect(someValue([], (val) => val > 10)).toBe(false);
    expect(someValue({}, (val) => val > 10)).toBe(false);
    expect(someValue(null, (val) => val > 10)).toBe(false);
    expect(someValue(undefined, (val) => val > 10)).toBe(false);
  });

  it('should return true if the predicate matches object value', () => {
    const obj = { a: 5, b: { c: 15 } };
    expect(someValue(obj, (val) => val.c > 10)).toBe(true);
  });

  it('should return true if the predicate matches nested array element', () => {
    const obj = { a: [1, 2, { d: 14 }] };
    expect(someValue(obj, (val) => val.d > 10)).toBe(true);
  });

  it('should return false if the predicate does not match any value', () => {
    const obj = { a: 5, b: { c: 9 } };
    expect(someValue(obj, (val) => val.c > 10)).toBe(false);
  });

  it('should handle primitives in object values', () => {
    const obj = { a: 1, b: 'string', c: true };
    const strPredicate = (val: any) => typeof val.b === 'string';
    expect(someValue(obj, strPredicate)).toBe(true);

    const boolPredicate = (val: any) => typeof val.c === 'boolean';
    expect(someValue(obj, boolPredicate)).toBe(true);
  });

  it('should handle deep nesting with mixed arrays and objects', () => {
    const complexObj = { a: { b: [1, 2, { c: 3 }, [{ d: 4 }]] } };
    expect(someValue(complexObj, (val) => val.d === 4)).toBe(true);
  });

  it('should handle functions and undefined values', () => {
    const objWithFunc = { a: () => {}, b: undefined };
    const funcPredicate = (val: any) => typeof val.a === 'function';
    expect(someValue(objWithFunc, funcPredicate)).toBe(true);

    const undefinedPredicate = (val: any) => val.b === undefined;
    expect(someValue(objWithFunc, undefinedPredicate)).toBe(true);
  });
});

describe('mapValue', () => {
  const predicate = (obj: any) => obj && obj.process;
  const processor = (obj: any, paths: any[]) => ({ ...obj, processed: true, paths });

  it('should not process object if it does not match the predicate', () => {
    const obj = { a: 3, b: { c: 4 } };
    expect(mapValue(obj, predicate, processor)).toEqual(obj);
  });

  it('should process object that matches the predicate', () => {
    const obj = { a: { process: true } };
    expect(mapValue(obj, predicate, processor)).toEqual({
      a: { process: true, processed: true, paths: ['a'] },
    });
  });

  it('should handle nested objects and arrays with various types of predicates', () => {
    const complexObj = {
      a: { key: 'value' },
      b: [{ key: 'value' }, undefined, null, 0, false],
      c: () => {},
    };
    const truthyPredicate = (obj: any) => 'key' in obj && obj.key === 'value';
    const falsePredicate = (obj: any) => false;

    expect(mapValue(complexObj, truthyPredicate, processor)).toEqual({
      a: { key: 'value', processed: true, paths: ['a'] },
      b: [{ key: 'value', processed: true, paths: ['b', 0] }, undefined, null, 0, false],
      c: complexObj.c,
    });

    expect(mapValue(complexObj, falsePredicate, processor)).toEqual(complexObj);
  });

  it('should process nested object and arrays that match the predicate', () => {
    const nestedObj = {
      a: { key: 'value', nested: { key: 'value' } },
    };
    const predicate = (obj: any) => 'key' in obj;

    const result = mapValue(nestedObj, predicate, processor);

    expect(result).toEqual({
      a: { key: 'value', processed: true, paths: ['a'], nested: { key: 'value' } },
    });
    expect(result.a.nested).not.toHaveProperty('processed');
  });
});
