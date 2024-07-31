import {
  evaluate,
  evaluateExpression,
  newFunction,
} from '../../src/script';

describe('evaluate', () => {
  test('should evaluate the given script', () => {
    const script = 'console.log("Hello, world!");';
    global.console = { log: jest.fn() };

    evaluate(script);

    expect(global.console.log).toHaveBeenCalledWith('Hello, world!');
  });
});

describe('evaluateExpression', () => {
  test('should evaluate the given expression', () => {
    const expr = 'return 1 + 2';

    const result = evaluateExpression(expr);

    expect(result).toBe(3);
  });
});

describe('newFunction', () => {
  test('should create a new function with the given arguments and code', () => {
    const args = 'a, b';
    const code = 'return a + b';

    const result = newFunction(args, code);

    expect(result).toBeInstanceOf(Function);
    expect(result(1, 2)).toBe(3);
  });

  test('should return null if an error occurs', () => {
    const args = 'a, b';
    const code = 'return a +;'; // Invalid code

    const result = newFunction(args, code);

    expect(result).toBeNull();
  });
});
