import type { ResultDir } from '@alilc/lowcode-types';
import _ from 'lodash';
import CodeGen from '../../../src';

const loadResult = (): ResultDir => _.cloneDeep(require('./example-result.json'));

describe('CodeGen.utils.resultHelper.removeDirsFromResult', () => {
  it('could remove src by "src"', () => {
    const result = loadResult();
    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
        "src",
        "src/components",
        "src/components/Hello",
      ]
    `);

    const removed = CodeGen.utils.resultHelper.removeDirsFromResult(result, 'src');

    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
      ]
    `);

    expect(removed).toBe(1);
  });

  it('could remove src/components/Hello by "*/components/*"', () => {
    const result = loadResult();
    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
        "src",
        "src/components",
        "src/components/Hello",
      ]
    `);

    const removed = CodeGen.utils.resultHelper.removeDirsFromResult(result, '*/components/*');

    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
        "src",
        "src/components",
      ]
    `);

    expect(removed).toBe(1);
  });

  it('could remove all dirs by "*"', () => {
    const result = loadResult();
    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
        "src",
        "src/components",
        "src/components/Hello",
      ]
    `);

    const removed = CodeGen.utils.resultHelper.removeDirsFromResult(result, '*');

    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
      ]
    `);

    expect(removed).toBe(1);
  });

  it('could remove all dirs by "**"', () => {
    const result = loadResult();
    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
        "src",
        "src/components",
        "src/components/Hello",
      ]
    `);

    const removed = CodeGen.utils.resultHelper.removeDirsFromResult(result, '**');

    expect(listAllDirs(result)).toMatchInlineSnapshot(`
      Array [
        "",
      ]
    `);

    expect(removed).toBe(3);
  });
});

function listAllDirs(result: ResultDir): string[] {
  return Array.from(CodeGen.utils.resultHelper.scanDirs(result)).map(([dirPath]) => dirPath);
}
