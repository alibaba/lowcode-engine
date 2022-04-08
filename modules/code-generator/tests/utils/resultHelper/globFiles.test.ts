import _ from 'lodash';
import CodeGen from '../../../src';

describe('CodeGen.utils.resultHelper.globFiles', () => {
  it('could find all files exclude dot files by **/*', () => {
    const result = require('./example-result.json') as any;
    const files = CodeGen.utils.resultHelper.globFiles(result, '**/*');
    expect(Array.from(files).map(_.first)).toMatchInlineSnapshot(`
      Array [
        "package.json",
        "src/index.js",
        "src/index.css",
        "src/components/index.js",
        "src/components/Hello/index.js",
        "src/components/Hello/index.css",
      ]
    `);
  });

  it('could find all files by **/* with option.dot = true ', () => {
    const result = require('./example-result.json') as any;
    const files = CodeGen.utils.resultHelper.globFiles(result, '**/*', { dot: true });
    expect(Array.from(files).map(_.first)).toMatchInlineSnapshot(`
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
  });

  it('could find all js files by **/*.js', () => {
    const result = require('./example-result.json') as any;
    const files = CodeGen.utils.resultHelper.globFiles(result, '**/*.js');
    expect(Array.from(files).map(_.first)).toMatchInlineSnapshot(`
      Array [
        "src/index.js",
        "src/components/index.js",
        "src/components/Hello/index.js",
      ]
    `);
  });

  it('could find package.json by package.json', () => {
    const result = require('./example-result.json') as any;
    const files = CodeGen.utils.resultHelper.globFiles(result, 'package.json');
    expect(Array.from(files).map(_.first)).toMatchInlineSnapshot(`
      Array [
        "package.json",
      ]
    `);
  });

  it('could find all index.js in components by **/components/*/index.js', () => {
    const result = require('./example-result.json') as any;
    const files = CodeGen.utils.resultHelper.globFiles(result, '**/components/*/index.js');
    expect(Array.from(files).map(_.first)).toMatchInlineSnapshot(`
      Array [
        "src/components/Hello/index.js",
      ]
    `);
  });
});
