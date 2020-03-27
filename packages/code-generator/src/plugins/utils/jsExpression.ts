import { CodeGeneratorError, IJSExpression } from '../../types';

export function transformFuncExpr2MethodMember(
  methodName: string,
  functionBody: string,
): string {
  if (functionBody.indexOf('function') < 8) {
    return functionBody.replace('function', methodName);
  }
  return functionBody;
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

export function generateValue(value: any): string {
  if (value && (value as IJSExpression).type === 'JSExpression') {
    return (value as IJSExpression).value;
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
