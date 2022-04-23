import type { ResultDir } from '@alilc/lowcode-types';
import _ from 'lodash';
import CodeGen from '../../../src';

const loadResult = (): ResultDir => _.cloneDeep(require('./example-result.json'));

describe('CodeGen.utils.resultHelper.removeFilesFromResult', () => {
  it('could remove package.json by "package.json"', () => {
    const result = loadResult();
    expect(listAllFiles(result)).toMatchInlineSnapshot(`
      Array [
        ".eslintrc",
        "package.json",
        "src/index.js",
        "src/index.css",
        "src/components/index.js",
        "src/components/Hello/index.js",
        "src/components/Hello/index.css",
      ]
    `);

    const removed = CodeGen.utils.resultHelper.removeFilesFromResult(result, 'package.json');

    expect(listAllFiles(result)).toMatchInlineSnapshot(`
      Array [
        ".eslintrc",
        "src/index.js",
        "src/index.css",
        "src/components/index.js",
        "src/components/Hello/index.js",
        "src/components/Hello/index.css",
      ]
    `);

    expect(removed).toBe(1);
  });

  it('could remove .eslintrc.json by ".eslintrc" with dot=true', () => {
    const result = loadResult();
    expect(listAllFiles(result)).toMatchInlineSnapshot(`
      Array [
        ".eslintrc",
        "package.json",
        "src/index.js",
        "src/index.css",
        "src/components/index.js",
        "src/components/Hello/index.js",
        "src/components/Hello/index.css",
      ]
    `);

    const removed = CodeGen.utils.resultHelper.removeFilesFromResult(result, '.eslintrc', {
      dot: true,
    });

    expect(listAllFiles(result)).toMatchInlineSnapshot(`
      Array [
        "package.json",
        "src/index.js",
        "src/index.css",
        "src/components/index.js",
        "src/components/Hello/index.js",
        "src/components/Hello/index.css",
      ]
    `);

    expect(removed).toBe(1);
  });

  it('could remove all css files by "**/*.css"', () => {
    const result = loadResult();
    expect(listAllFiles(result)).toMatchInlineSnapshot(`
      Array [
        ".eslintrc",
        "package.json",
        "src/index.js",
        "src/index.css",
        "src/components/index.js",
        "src/components/Hello/index.js",
        "src/components/Hello/index.css",
      ]
    `);

    const removed = CodeGen.utils.resultHelper.removeFilesFromResult(result, '**/*.css');

    expect(listAllFiles(result)).toMatchInlineSnapshot(`
      Array [
        ".eslintrc",
        "package.json",
        "src/index.js",
        "src/components/index.js",
        "src/components/Hello/index.js",
      ]
    `);

    expect(removed).toBe(2);
  });
});

function listAllFiles(result: ResultDir): string[] {
  return Array.from(CodeGen.utils.resultHelper.scanFiles(result)).map(([filePath]) => filePath);
}
