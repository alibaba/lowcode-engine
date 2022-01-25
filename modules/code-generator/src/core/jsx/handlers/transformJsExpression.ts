import { IScope } from '../../../types';
import { parseExpression } from '../../../utils/expressionParser';
import { isLiteralAtomicExpr } from '../util/isLiteralAtomicExpr';
import { isSimpleStraightLiteral } from '../util/isSimpleStraightLiteral';
import { transformThis2Context } from './transformThis2Context';

export function transformJsExpr(
  expr: string,
  scope: IScope,
  { dontWrapEval = false, dontTransformThis2ContextAtRootScope = false } = {},
) {
  if (!expr) {
    return 'undefined';
  }

  if (isLiteralAtomicExpr(expr)) {
    return expr;
  }

  const exprAst = parseExpression(expr);

  // 对于下面这些比较安全的字面值，可以直接返回对应的表达式，而非包一层
  if (isSimpleStraightLiteral(exprAst)) {
    return expr;
  }

  if (dontWrapEval) {
    return transformThis2Context(exprAst, scope, {
      ignoreRootScope: dontTransformThis2ContextAtRootScope,
    });
  }

  switch (exprAst.type) {
    // 对于直接写个函数的，则不用再包下，因为这样不会抛出异常的
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return transformThis2Context(exprAst, scope, {
        ignoreRootScope: dontTransformThis2ContextAtRootScope,
      });

    default:
      break;
  }

  // 其他的都需要包一层
  return `__$$eval(() => (${transformThis2Context(exprAst, scope, {
    ignoreRootScope: dontTransformThis2ContextAtRootScope,
  })}))`;
}
