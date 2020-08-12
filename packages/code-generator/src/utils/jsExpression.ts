import { JSExpression, JSFunction } from '@ali/lowcode-types';

import { CodeGeneratorError } from '../types';

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

  // test(functionBody);

  if (start < 0 || end < 0 || end < start) {
    throw new CodeGeneratorError('JSExpression has no valid body.');
  }

  const body = functionBody.slice(start + 1, end);
  return body;
}

export function getArrowFunction(functionBody: string) {
  const args = getFuncExprArguments(functionBody);
  const body = getFuncExprBody(functionBody);

  return `(${args}) => { ${body} }`;
}

export function isJSExpression(value: unknown): boolean {
  return value && typeof value === 'object' && (value as JSExpression).type === 'JSExpression';
}

export function isJSFunction(value: unknown): boolean {
  return value && typeof value === 'object' && (value as JSFunction).type === 'JSFunction';
}

export function isJsCode(value: unknown): boolean {
  return isJSExpression(value) || isJSFunction(value);
}

export function generateExpression(value: any): string {
  if (isJSExpression(value)) {
    return (value as JSExpression).value || 'null';
  }

  throw new CodeGeneratorError('Not a JSExpression');
}

export function generateFunction(
  value: any,
  config: {
    name?: string;
    isMember?: boolean;
    isBlock?: boolean;
    isArrow?: boolean;
  } = {
    name: undefined,
    isMember: false,
    isBlock: false,
    isArrow: false,
  },
) {
  if (isJsCode(value)) {
    const functionCfg = value as JSFunction;
    if (config.isMember) {
      return transformFuncExpr2MethodMember(config.name || '', functionCfg.value);
    }
    if (config.isBlock) {
      return getFuncExprBody(functionCfg.value);
    }
    if (config.isArrow) {
      return getArrowFunction(functionCfg.value);
    }
    return functionCfg.value;
  }

  throw new CodeGeneratorError('Not a JSFunction or JSExpression');
}
