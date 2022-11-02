import { parseExpressionGetKeywords } from '../../../src/utils/expressionParser';

const marcoFactory = () => {
  const cases: any[] = [];

  const marco = (input: string | null, expected: any) => {
    cases.push([input, expected]);
  };

  const start = () => {
    test.each(cases)(
      `after convert this to context "${1}" should be "${2}"`,
      (a, expected) => {
        expect(parseExpressionGetKeywords(a)).toEqual(expected);
      },
    );
  };

  return { marco, start };
};

const { marco: testMarco, start: startMarco } = marcoFactory();

// 支持普通函数
testMarco('function isDisabled(row) {}', []);
testMarco('function content() { \n  return "hello world"\n}', []);

// 支持 jsx 表达式
testMarco('function content() { \n  return <div>自定义在div内容123</div> \n}', []);

startMarco();
