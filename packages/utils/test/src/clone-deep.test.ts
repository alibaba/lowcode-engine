import { cloneDeep } from '../../src/clone-deep';

describe('cloneDeep', () => {
  it('should clone null', () => {
    const src = null;
    expect(cloneDeep(src)).toBeNull();
  });

  it('should clone undefined', () => {
    const src = undefined;
    expect(cloneDeep(src)).toBeUndefined();
  });

  it('should clone an array', () => {
    const src = [1, 2, 3, 4];
    expect(cloneDeep(src)).toEqual(src);
  });

  it('should clone an object', () => {
    const src = { name: 'John', age: 25 };
    expect(cloneDeep(src)).toEqual(src);
  });

  it('should deep clone nested objects', () => {
    const src = { person: { name: 'John', age: 25 } };
    const cloned = cloneDeep(src);
    expect(cloned).toEqual(src);
    expect(cloned.person).not.toBe(src.person);
  });
});