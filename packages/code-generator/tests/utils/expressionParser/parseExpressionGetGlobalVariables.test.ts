import {
  parseExpressionGetGlobalVariables,
  // ParseExpressionGetGlobalVariablesOptions,
} from '../../../src/utils/expressionParser';

const marcoFactory = () => {
  const cases: any[] = [];

  const marco = (input: any[], expected: string[]) => {
    const tmpInput = [...input];
    while (tmpInput.length < 2) {
      tmpInput.push(undefined);
    }
    cases.push([...tmpInput, expected]);
  };

  const start = () => {
    test.each(cases)(`global variables of "${1}" should be "${3}"`, (a, b, expected) => {
      expect(parseExpressionGetGlobalVariables(a, b)).toEqual(expected);
    });
  };

  return { marco, start };
};

const { marco: testMarco, start: startMarco } = marcoFactory();

testMarco(['function (){ }', {}], []);
testMarco(['function (){ __$$context.utils.Toast.show("Hello world!") }', {}], ['__$$context']);

testMarco(
  ['function (){ __$$context.utils.formatPrice(item.price1, "元") }', {}],
  ['__$$context', 'item'],
);

testMarco(
  [
    'function (){ __$$context.utils.formatPrice(item2, "元"); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item2'],
);

testMarco(
  [
    'function (){ __$$context.utils.log(item3, [item4, item5]); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3', 'item4', 'item5'],
);

testMarco(
  [
    'function (){ item3[item4]("Hello"); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3', 'item4'],
);

testMarco(
  ['function (){ item3("Hello"); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['item3'],
);

testMarco(
  [
    'function foo(){ foo[item3]("Hello"); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3'],
);

// isAssignmentExpression/right
testMarco(
  [
    'function (){ let foo; foo = item3; foo(); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3'],
);

// isAssignmentExpression/left
testMarco(
  ['function (){ foo = item3; foo(); }', { filter: (varName: string) => !/^__\$\$/.test(varName) }],
  ['foo', 'item3'],
);

// isVariableDeclarator
testMarco(
  [
    'function (){ const foo = item3; foo(); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3'],
);

// isVariableDeclarator
testMarco(
  [
    'function (){ let foo = item3; foo(); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3'],
);

// isVariableDeclarator
testMarco(
  [
    'function (){ var foo = item3; foo(); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['item3'],
);

// isTemplateLiteral
testMarco(
  [
    'function (){ console.log(`Hello ${item3};`); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['console', 'item3'],
);

// isBinaryExpression
testMarco(
  [
    'function (){ console.log(item2 | item3); }',
    { filter: (varName: string) => !/^__\$\$/.test(varName) },
  ],
  ['console', 'item2', 'item3'],
);

// TODO: 补充更多类型的测试用例
startMarco();
