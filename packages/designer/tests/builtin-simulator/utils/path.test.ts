import {
  generateComponentName,
  getNormalizedImportPath,
  isPackagePath,
  toTitleCase,
  makeRelativePath,
  removeVersion,
  resolveAbsoluatePath,
  joinPath,
} from '../../../src/builtin-simulator/utils/path';

describe('builtin-simulator/utils/path 测试', () => {
  it('isPackagePath', () => {
    expect(isPackagePath('a')).toBeTruthy();
    expect(isPackagePath('@ali/a')).toBeTruthy();
    expect(isPackagePath('@alife/a')).toBeTruthy();
    expect(isPackagePath('a.b')).toBeTruthy();
    expect(isPackagePath('./a')).toBeFalsy();
    expect(isPackagePath('../a')).toBeFalsy();
    expect(isPackagePath('/a')).toBeFalsy();
  });

  it('toTitleCase', () => {
    expect(toTitleCase('a')).toBe('A');
    expect(toTitleCase('a_b')).toBe('AB');
    expect(toTitleCase('a b')).toBe('AB');
    expect(toTitleCase('a-b')).toBe('AB');
    expect(toTitleCase('a.b')).toBe('AB');
    expect(toTitleCase('a.b.cx')).toBe('ABCx');
  });

  it('generateComponentName', () => {
    expect(generateComponentName('a/index.js')).toBe('A');
    expect(generateComponentName('a_b/index.js')).toBe('AB');
    expect(generateComponentName('a_b/index.web.js')).toBe('AB');
    expect(generateComponentName('a_b/index.xxx.js')).toBe('AB');
    expect(generateComponentName('a_b')).toBe('AB');
    expect(generateComponentName('')).toBe('Component');
  });

  it('getNormalizedImportPath', () => {
    expect(getNormalizedImportPath('/a')).toBe('/a');
    expect(getNormalizedImportPath('/a/')).toBe('/a/');
    expect(getNormalizedImportPath('/a/index.js')).toBe('/a');
    expect(getNormalizedImportPath('/a/index.ts')).toBe('/a');
    expect(getNormalizedImportPath('/a/index.jsx')).toBe('/a');
    expect(getNormalizedImportPath('/a/index.tsx')).toBe('/a');
    expect(getNormalizedImportPath('/a/index.x')).toBe('/a/index.x');
  });

  it('makeRelativePath', () => {
    expect(makeRelativePath('/a/b/c', '/a/b')).toBe('c');
    expect(makeRelativePath('a/b/c', '/a/c')).toBe('a/b/c');
    expect(makeRelativePath('/a/b/c', '/a/c')).toBe('./b/c');
    expect(makeRelativePath('/a/b/c', '/a/c/d')).toBe('../b/c');
  });

  it('resolveAbsoluatePath', () => {
    expect(resolveAbsoluatePath('/a/b/c', '/a')).toBe('/a/b/c');
    expect(resolveAbsoluatePath('@ali/fe', '/a')).toBe('@ali/fe');
    expect(resolveAbsoluatePath('./a/b', '/c')).toBe('/c/a/b');
    expect(resolveAbsoluatePath('./a/b/d', '/c')).toBe('/c/a/b/d');
    expect(resolveAbsoluatePath('../a/b', '/c')).toBe('/a/b');
    expect(resolveAbsoluatePath('../a/b/d', '/c')).toBe('/a/b/d');
    expect(resolveAbsoluatePath('../../a', 'c')).toBe('../a');
  });

  it('joinPath', () => {
    expect(joinPath('/a', 'b', 'c')).toBe('/a/b/c');
    expect(joinPath('a', 'b', 'c')).toBe('./a/b/c');
  });

  it('removeVersion', () => {
    expect(removeVersion('@ali/fe')).toBe('@ali/fe');
    expect(removeVersion('@ali/fe@1.0.0/index')).toBe('@ali/fe/index');
    expect(removeVersion('haha')).toBe('haha');
  });
});
