import { generateCompositeType } from '../../src/utils/compositeType';
import { parseExpressionConvertThis2Context } from '../../src/utils/expressionParser';
import { Scope } from '../../src/utils/Scope';

test('single line string', () => {
  expect(generateCompositeType('ab c', Scope.createRootScope())).toEqual('"ab c"');
});

test('multi line string', () => {
  expect(generateCompositeType('a\nb\nc', Scope.createRootScope())).toEqual('"a\\nb\\nc"');
});

test('string with single quote', () => {
  expect(generateCompositeType("a'bc", Scope.createRootScope())).toEqual('"a\'bc"');
});

test('string with double quote', () => {
  expect(generateCompositeType('a"bc', Scope.createRootScope())).toEqual('"a\\"bc"');
});

const marcoFactory = () => {
  const cases: any[] = [];

  const marco = (value: any, cb: (expression: string) => void) => {
    cases.push([value, cb]);
  };

  const start = () => {
    test.each(cases)('parse expression %s', (item, cb) => {
      const testObj = {
        globalConfig: {},
        online: [
          {
            description: '表格（CnTable）的数据源',
            initialData: {
              type: 'variable',
              variable: item,
              value: '',
            },
            somethingelse: 'somethingelse',
          },
        ],
      };
      const ret = generateCompositeType(testObj, Scope.createRootScope(), {
        handlers: {
          function: (jsFunc) => parseExpressionConvertThis2Context(jsFunc.value, '_this'),
          expression: (jsExpr) => parseExpressionConvertThis2Context(jsExpr.value, '_this'),
        },
      });
      cb(ret);
    });
  };

  return { marco, start };
};

const { marco: testMarco, start: startMarco } = marcoFactory();

/**
 * dataSource 为低码编辑器里面数据源的输入
 * variable 为 schema 存储的结果
 * expect 为出码后期望生产的串

 * |dataSource         | variable                   | expect
 * |-------------------|----------------------------|--------------
 * |""                 | "\"\""                     | ""
 * |"helo world"       | "\"hello world\""          | "hello world"
 * |true               | "true"                     | true
 * |false              | "false"                    | false
 * |{"name": gaokai}   | "{\"name\": \"cone\"}"     | {"name": gaokai}
 * |                   | ""                         | undefined
 * |undefined          | "undefined"                | undefined
 * |null               | "null"                     | null
 */

testMarco('""', (expression) => {
  expect(expression).toMatchInlineSnapshot(`
    "{\\"globalConfig\\": {},
    \\"online\\": [{\\"description\\": \\"表格（CnTable）的数据源\\",
    \\"initialData\\": \\"\\",
    \\"somethingelse\\": \\"somethingelse\\"}]}"
  `);
});

testMarco('"hello world"', (expression) => {
  expect(expression).toMatchInlineSnapshot(`
    "{\\"globalConfig\\": {},
    \\"online\\": [{\\"description\\": \\"表格（CnTable）的数据源\\",
    \\"initialData\\": \\"hello world\\",
    \\"somethingelse\\": \\"somethingelse\\"}]}"
  `);
});

testMarco('true', (expression) => {
  expect(expression).toMatchInlineSnapshot(`
    "{\\"globalConfig\\": {},
    \\"online\\": [{\\"description\\": \\"表格（CnTable）的数据源\\",
    \\"initialData\\": true,
    \\"somethingelse\\": \\"somethingelse\\"}]}"
  `);
});

testMarco('{"name": "cone"}', (expression) => {
  expect(expression).toMatchInlineSnapshot(`
    "{\\"globalConfig\\": {},
    \\"online\\": [{\\"description\\": \\"表格（CnTable）的数据源\\",
    \\"initialData\\": {
      \\"name\\": \\"cone\\"
    },
    \\"somethingelse\\": \\"somethingelse\\"}]}"
  `);
});

testMarco('', (expression) => {
  expect(expression).toMatchInlineSnapshot(`
    "{\\"globalConfig\\": {},
    \\"online\\": [{\\"description\\": \\"表格（CnTable）的数据源\\",
    \\"initialData\\": undefined,
    \\"somethingelse\\": \\"somethingelse\\"}]}"
  `);
});

testMarco('undefined', (expression) => {
  expect(expression).toMatchInlineSnapshot(`
    "{\\"globalConfig\\": {},
    \\"online\\": [{\\"description\\": \\"表格（CnTable）的数据源\\",
    \\"initialData\\": undefined,
    \\"somethingelse\\": \\"somethingelse\\"}]}"
  `);
});

testMarco('null', (expression) => {
  expect(expression).toMatchInlineSnapshot(`
    "{\\"globalConfig\\": {},
    \\"online\\": [{\\"description\\": \\"表格（CnTable）的数据源\\",
    \\"initialData\\": null,
    \\"somethingelse\\": \\"somethingelse\\"}]}"
  `);
});

startMarco();
