import { CodeGeneratorError, isJSExpression, isJSFunction } from '../types';

export function transformFuncExpr2MethodMember(methodName: string, functionBody: string): string {
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

  if (start < 0 || end < 0 || end < start) {
    throw new CodeGeneratorError('JSExpression has no valid body.');
  }

  const body = functionBody.slice(start + 1, end);
  return body;
}

export function generateExpression(value: any): string {
  if (isJSExpression(value)) {
    return value.value || 'null';
  }

  throw new CodeGeneratorError('Not a JSExpression');
}

// TODO: 这样真的可以吗？
export function generateFunction(value: any): string {
  if (isJSFunction(value)) {
    return value.value || 'null';
  }

  throw new CodeGeneratorError('Not a isJSFunction');
}
