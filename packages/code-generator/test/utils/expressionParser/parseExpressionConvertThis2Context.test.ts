import test from 'ava';
import type { ExecutionContext, Macro } from 'ava';
import { parseExpressionConvertThis2Context } from '../../../src/utils/expressionParser';

const macro: Macro<any[]> = (
  t: ExecutionContext<Record<string, unknown>>,
  input: [string, string, string[]],
  expected: string,
  error?: { message: RegExp },
) => {
  if (!error) {
    t.deepEqual(parseExpressionConvertThis2Context(input[0], input[1], input[2]), expected);
  } else {
    t.throws(() => {
      t.deepEqual(parseExpressionConvertThis2Context(input[0], input[1], input[2]), expected);
    }, error.message);
  }
};

macro.title = (providedTitle: string | undefined, ...args: any[]): string => {
  const [input, expected] = args;
  return providedTitle || `after convert this to context "${input[0]}" should be "${expected}"`.replace(/\n|\s+/g, ' ');
};

test(macro, ['this.hello', '__$$context', []], '__$$context.hello');
test(macro, ['this.utils.recordEvent', '__$$context', []], '__$$context.utils.recordEvent');

test(
  macro,
  ['this.utils.recordEvent.bind(this)', '__$$context', []],
  '__$$context.utils.recordEvent.bind(__$$context)',
);

test(macro, ['this.item', '__$$context', ['item']], 'item');

test(macro, ['this.user.name', '__$$context', ['user']], 'user.name');

test(macro, ['function (){}', '__$$context', []], 'function () {}');

test(
  macro,
  ['function (){ this.utils.Toast.show("Hello world!") }', '__$$context'],
  'function () {\n  __$$context.utils.Toast.show("Hello world!");\n}',
);

// 变量能被替换掉
test(
  macro,
  ['function (){ this.utils.recordEvent("click", this.item) }', '__$$context', ['item']],
  'function () {\n  __$$context.utils.recordEvent("click", item);\n}',
);

// 只替换顶层的，不替换内层
test(
  macro,
  ['function (){ return function (){ this.utils.recordEvent("click", this.item) } }', '__$$context', ['item']],
  'function () {\n  return function () {\n    this.utils.recordEvent("click", item);\n  };\n}',
);

// 只替换顶层的，不替换内层
test(
  macro,
  ['function onClick(){ return function (){ this.utils.recordEvent("click", this.item) } }', '__$$context', ['item']],
  'function onClick() {\n  return function () {\n    this.utils.recordEvent("click", item);\n  };\n}',
);

// 只替换顶层的，不替换内层
test(
  macro,
  ['() => { return function (){ this.utils.recordEvent("click", this.item) } }', '__$$context', ['item']],
  '() => {\n  return function () {\n    this.utils.recordEvent("click", item);\n  };\n}',
);

// 但是若内层有用箭头函数定义的则还是要替换下
test(
  macro,
  ['() => { return () => { this.utils.recordEvent("click", this.item) } }', '__$$context', ['item']],
  '() => {\n  return () => {\n    __$$context.utils.recordEvent("click", item);\n  };\n}',
);
