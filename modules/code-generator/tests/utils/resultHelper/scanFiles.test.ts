import CodeGen from '../../../src';

describe('CodeGen.utils.resultHelper.scanFiles', () => {
  it('should works', () => {
    const result = require('./example-result.json') as any;
    const files = CodeGen.utils.resultHelper.scanFiles(result);
    expect(Array.from(files)).toMatchInlineSnapshot(`
      Array [
        Array [
          ".eslintrc",
          Object {
            "content": "{}",
            "ext": "",
            "name": ".eslintrc",
          },
        ],
        Array [
          "package.json",
          Object {
            "content": "{ \\"name\\": \\"demo\\", \\"version\\":\\"1.0.0\\" }",
            "ext": "json",
            "name": "package",
          },
        ],
        Array [
          "src/index.js",
          Object {
            "content": "console.log(\\"Hello\\")",
            "ext": "js",
            "name": "index",
          },
        ],
        Array [
          "src/index.css",
          Object {
            "content": "html,body{ padding: 0; }",
            "ext": "css",
            "name": "index",
          },
        ],
        Array [
          "src/components/index.js",
          Object {
            "content": "export * from \\"./Hello\\";",
            "ext": "js",
            "name": "index",
          },
        ],
        Array [
          "src/components/Hello/index.js",
          Object {
            "content": "export default () => <div>Hello</div>",
            "ext": "js",
            "name": "index",
          },
        ],
        Array [
          "src/components/Hello/index.css",
          Object {
            "content": ".hello {color: red}",
            "ext": "css",
            "name": "index",
          },
        ],
      ]
    `);
  });
});
