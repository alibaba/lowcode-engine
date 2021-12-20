import { parseExpressionConvertThis2Context } from '../../../src/utils/expressionParser';

// return providedTitle || `after convert this to context "${input[0]}" should be "${expected}"`.replace(/\n|\s+/g, ' ');

const marcoFactory = () => {
  const cases: any[] = [];

  const marco = (input: any[], expected: string) => {
    const tmpInput = [...input];
    while (tmpInput.length < 3) {
      tmpInput.push(undefined);
    }
    cases.push([...tmpInput, expected]);
  };

  const start = () => {
    test.each(cases)(
      `after convert this to context "${1}" should be "${4}"`,
      (a, b, c, expected) => {
        expect(parseExpressionConvertThis2Context(a, b, c)).toEqual(expected);
      },
    );
  };

  return { marco, start };
};

const { marco: testMarco, start: startMarco } = marcoFactory();

testMarco(['this.hello', '__$$context', []], '__$$context.hello');
testMarco(['this.utils.recordEvent', '__$$context', []], '__$$context.utils.recordEvent');

testMarco(
  ['this.utils.recordEvent.bind(this)', '__$$context', []],
  '__$$context.utils.recordEvent.bind(__$$context)',
);

testMarco(['this.item', '__$$context', ['item']], 'item');

testMarco(['this.user.name', '__$$context', ['user']], 'user.name');

testMarco(['function (){}', '__$$context', []], 'function () {}');

testMarco(
  ['function (){ this.utils.Toast.show("Hello world!") }', '__$$context'],
  'function () {\n  __$$context.utils.Toast.show("Hello world!");\n}',
);

// 变量能被替换掉
testMarco(
  ['function (){ this.utils.recordEvent("click", this.item) }', '__$$context', ['item']],
  'function () {\n  __$$context.utils.recordEvent("click", item);\n}',
);

// 只替换顶层的，不替换内层
testMarco(
  [
    'function (){ return function (){ this.utils.recordEvent("click", this.item) } }',
    '__$$context',
    ['item'],
  ],
  'function () {\n  return function () {\n    this.utils.recordEvent("click", item);\n  };\n}',
);

// 只替换顶层的，不替换内层
testMarco(
  [
    'function onClick(){ return function (){ this.utils.recordEvent("click", this.item) } }',
    '__$$context',
    ['item'],
  ],
  'function onClick() {\n  return function () {\n    this.utils.recordEvent("click", item);\n  };\n}',
);

// 只替换顶层的，不替换内层
testMarco(
  [
    '() => { return function (){ this.utils.recordEvent("click", this.item) } }',
    '__$$context',
    ['item'],
  ],
  '() => {\n  return function () {\n    this.utils.recordEvent("click", item);\n  };\n}',
);

// 但是若内层有用箭头函数定义的则还是要替换下
testMarco(
  [
    '() => { return () => { this.utils.recordEvent("click", this.item) } }',
    '__$$context',
    ['item'],
  ],
  '() => {\n  return () => {\n    __$$context.utils.recordEvent("click", item);\n  };\n}',
);

startMarco();
