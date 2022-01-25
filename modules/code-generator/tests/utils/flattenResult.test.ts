import { flattenResult } from '../../src/utils/resultHelper';

test('utils/flattenResult', () => {
  expect(
    flattenResult({
      name: 'demo',
      dirs: [
        {
          name: 'src',
          dirs: [
            {
              name: 'components',
              dirs: [
                {
                  name: 'Hello',
                  dirs: [],
                  files: [
                    {
                      name: 'index',
                      ext: 'js',
                      content: 'export default () => <div>Hello</div>',
                    },
                  ],
                },
              ],
              files: [
                {
                  name: 'index',
                  ext: 'js',
                  content: 'export * from "./Hello";',
                },
              ],
            },
          ],
          files: [{ name: 'index', ext: 'js', content: 'console.log("Hello")' }],
        },
      ],
      files: [{ name: '.eslintrc', ext: '', content: '{}' }],
    }),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "content": "{}",
        "pathName": ".eslintrc",
      },
      Object {
        "content": "console.log(\\"Hello\\")",
        "pathName": "src/index.js",
      },
      Object {
        "content": "export * from \\"./Hello\\";",
        "pathName": "src/components/index.js",
      },
      Object {
        "content": "export default () => <div>Hello</div>",
        "pathName": "src/components/Hello/index.js",
      },
    ]
  `);
});
