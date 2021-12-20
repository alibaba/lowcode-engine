import * as parser from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { JSExpression, JSFunction, isJSExpression, isJSFunction } from '@ali/lowcode-types';
import { CodeGeneratorError, IScope } from '../types';
import { transformExpressionLocalRef, ParseError } from '../utils/expressionParser';

// demo: https://riddle.alibaba-inc.com/riddles/3d4c977f

function parseFunction(content: string): t.FunctionExpression | null {
  try {
    const ast = parser.parse(`(${content});`);
    let resultNode: t.FunctionExpression | null = null;
    traverse(ast, {
      FunctionExpression(path) {
        resultNode = path.node;
        path.stop();
      },
    });
    return resultNode;
  } catch (e) {
    throw new ParseError(content, e);
  }
}

function transformFuncExpr2MethodMember(methodName: string, content: string): string {
  const funcNode = parseFunction(content);
  if (funcNode) {
    const targetNode = t.classMethod(
      'method',
      (methodName && t.identifier(methodName)) || funcNode.id || t.identifier('notDefineName'),
      funcNode.params,
      funcNode.body,
      undefined,
      undefined,
      undefined,
      funcNode.async || undefined,
    );

    const { code: resultCode } = generate(targetNode, { sourceMaps: false });
    return resultCode;
  }

  throw new Error('Can not find Function Statement');
}

function getArrowFunction(content: string) {
  const funcNode = parseFunction(content);
  if (funcNode) {
    const targetNode = t.arrowFunctionExpression(
      funcNode.params,
      funcNode.body,
      funcNode.async || undefined,
    );

    const { code: resultCode } = generate(targetNode, { sourceMaps: false });
    return resultCode;
  }

  throw new Error('Can not find Function Statement');
}

function getBodyStatements(content: string) {
  const funcNode = parseFunction(content);
  if (funcNode) {
    const statements: t.Statement[] = funcNode.body.body;

    const targetNode = t.program(
      statements,
      undefined,
      'module',
      undefined,
    );

    const { code: resultCode } = generate(targetNode, { sourceMaps: false });
    return resultCode;
  }

  throw new Error('Can not find Function Statement');
}

export function isJsCode(value: unknown): boolean {
  return isJSExpression(value) || isJSFunction(value);
}

export function generateExpression(value: any, scope: IScope): string {
  if (isJSExpression(value)) {
    const exprVal = (value as JSExpression).value;
    if (!exprVal) {
      return 'null';
    }
    const afterProcessWithLocals = transformExpressionLocalRef(exprVal, scope);
    return afterProcessWithLocals;
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
    isBindExpr?: boolean;
  } = {
    name: undefined,
    isMember: false,
    isBlock: false,
    isArrow: false,
    isBindExpr: false,
  },
) {
  if (isJsCode(value)) {
    const functionCfg = value as JSFunction;
    if (config.isMember) {
      return transformFuncExpr2MethodMember(config.name || '', functionCfg.value);
    }
    if (config.isBlock) {
      return getBodyStatements(functionCfg.value);
    }
    if (config.isArrow) {
      return getArrowFunction(functionCfg.value);
    }
    if (config.isBindExpr) {
      return `(${functionCfg.value}).bind(this)`;
    }
    return functionCfg.value;
  }

  throw new CodeGeneratorError('Not a JSFunction or JSExpression');
}
