import _ from 'lodash';
import CodeGen from '../../../src';

describe('CodeGen.utils.resultHelper.findFile', () => {
  it('could package.json by "package.json"', () => {
    const result = require('./example-result.json') as any;
    const found = CodeGen.utils.resultHelper.findFile(result, 'package.json');
    expect(found).toMatchInlineSnapshot(`
      Object {
        "content": "{ \\"name\\": \\"demo\\", \\"version\\":\\"1.0.0\\" }",
        "ext": "json",
        "name": "package",
      }
    `);
  });

  it('could find a internal component by src/components/*/index.js', () => {
    const result = require('./example-result.json') as any;
    const found = CodeGen.utils.resultHelper.findFile(result, 'src/components/*/index.js');
    expect(found).toMatchInlineSnapshot(`
      Object {
        "content": "export default () => <div>Hello</div>",
        "ext": "js",
        "name": "index",
      }
    `);
  });

  it('could not find non-existing file', () => {
    const result = require('./example-result.json') as any;
    const found = CodeGen.utils.resultHelper.findFile(result, 'something-not-exist.js');
    expect(found).toBeNull();
  });
});
