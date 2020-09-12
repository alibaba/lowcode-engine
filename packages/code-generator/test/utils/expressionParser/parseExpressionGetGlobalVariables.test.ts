import test from 'ava';
import type { ExecutionContext, Macro } from 'ava';
import {
  parseExpressionGetGlobalVariables,
  ParseExpressionGetGlobalVariablesOptions,
} from '../../../src/utils/expressionParser';

const macro: Macro<any[]> = (
  t: ExecutionContext<Record<string, unknown>>,
  input: [string | null | undefined, ParseExpressionGetGlobalVariablesOptions],
  expected: string[],
  error?: { message: RegExp },
) => {
  if (!error) {
    t.deepEqual(parseExpressionGetGlobalVariables(input[0], input[1]), expected);
  } else {
    t.throws(() => {
      t.deepEqual(parseExpressionGetGlobalVariables(input[0], input[1]), expected);
    }, error.message);
  }
};

macro.title = (providedTitle: string | undefined, ...args: any[]): string => {
  const [input, expected] = args;
  return providedTitle || `global variables of "${input[0]}" should be "${expected.join(', ')}"`;
};

test(macro, ['function (){ }', {}], []);
test(macro, ['function (){ __$$context.utils.Toast.show("Hello world!") }', {}], ['__$$context']);

test(macro, ['function (){ __$$context.utils.formatPrice(item.price1, "元") }', {}], ['__$$context', 'item']);

test(
  macro,
  [
    'function (){ __$$context.utils.formatPrice(item2, "元"); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item2'],
);

test(
  macro,
  [
    'function (){ __$$context.utils.log(item3, [item4, item5]); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3', 'item4', 'item5'],
);

test(
  macro,
  ['function (){ item3[item4]("Hello"); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['item3', 'item4'],
);

test(macro, ['function (){ item3("Hello"); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }], ['item3']);

test(
  macro,
  ['function foo(){ foo[item3]("Hello"); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['item3'],
);

// isAssignmentExpression/right
test(
  macro,
  ['function (){ let foo; foo = item3; foo(); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['item3'],
);

// isAssignmentExpression/left
test(
  macro,
  ['function (){ foo = item3; foo(); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['foo', 'item3'],
);

// isVariableDeclarator
test(
  macro,
  ['function (){ const foo = item3; foo(); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['item3'],
);

// isVariableDeclarator
test(
  macro,
  ['function (){ let foo = item3; foo(); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['item3'],
);

// isVariableDeclarator
test(
  macro,
  ['function (){ var foo = item3; foo(); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['item3'],
);

// isTemplateLiteral
test(
  macro,
  ['function (){ console.log(`Hello ${item3};`); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['console', 'item3'],
);

// isBinaryExpression
test(
  macro,
  ['function (){ console.log(item2 | item3); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['console', 'item2', 'item3'],
);

// TODO: 补充更多类型的测试用例
