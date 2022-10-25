import { generateFunction } from '../../../src/utils/jsExpression';

const marcoFactory = () => {
  const cases: any[] = [];

  const marco = (
    value: { type: string; value: string },
    config: Record<string, string | boolean>,
    expected: any,
  ) => {
    cases.push([value, config, expected]);
  };

  const start = () => {
    test.each(cases)(`after convert this to context "${1}" should be "${3}"`, (a, b, expected) => {
      expect(generateFunction(a, b)).toEqual(expected);
    });
  };

  return { marco, start };
};

const { marco: testMarco, start: startMarco } = marcoFactory();

// 支持普通函数
testMarco(
  {
    type: 'JSFunction',
    value: 'function isDisabled(row, rowIndex) { \n  \n}',
  },
  { isArrow: true },
  '(row, rowIndex) => {}',
);

// 支持 jsx 表达式
testMarco(
  {
    type: 'JSFunction',
    value: 'function content() { \n  return <div>我是自定义在div内容123</div> \n}',
  },
  { isArrow: true },
  '() => {\n  return <div>我是自定义在div内容123</div>;\n}',
);

startMarco();
