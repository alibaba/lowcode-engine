import traverse from '@babel/traverse';
import * as parser from '@babel/parser';
import { CodeGeneratorError, IJSExpression } from '../types';

let count = 0;

function test(functionBody: string) {
  console.log(functionBody);
  console.log('---->');
  try {
    const parseResult = parser.parse(functionBody);
    // console.log(JSON.stringify(parseResult));
    traverse(parseResult, {
      enter(path) {
        console.log('path: ', JSON.stringify(path));
      }
    });

    if (count === 0) {
      count++;

      test('this.aaa && this.bbb');
    }
  } catch (error) {
    // console.log('Error');
    console.log(error.message);
  }
  console.log('=====================');
}

export function transformFuncExpr2MethodMember(
  methodName: string,
  functionBody: string,
): string {
  // test(functionBody);

  const args = getFuncExprArguments(functionBody);
  const body = getFuncExprBody(functionBody);

  return `${methodName}(${args}) { ${body} }`;
}

export function getFuncExprArguments(functionBody: string) {
  const start = functionBody.indexOf('(');
  const end = functionBody.indexOf(')');

  if (start < 0 || end < 0 || end < start) {
    throw new CodeGeneratorError('JSExpression has no valid arguments.');
  }

  const args = functionBody.slice(start + 1, end);
  return args;
}

export function getFuncExprBody(functionBody: string) {
  const start = functionBody.indexOf('{');
  const end = functionBody.lastIndexOf('}');

  // test(functionBody);

  if (start < 0 || end < 0 || end < start) {
    throw new CodeGeneratorError('JSExpression has no valid body.');
  }

  const body = functionBody.slice(start + 1, end);
  return body;
}

export function generateExpression(value: any): string {
  if (value && (value as IJSExpression).type === 'JSExpression') {
    // test((value as IJSExpression).value);

    return (value as IJSExpression).value || 'null';
  }

  throw new CodeGeneratorError('Not a JSExpression');
}

export function isJsExpression(value: any): boolean {
  return (
    value &&
    typeof value === 'object' &&
    (value as IJSExpression).type === 'JSExpression'
  );
}
