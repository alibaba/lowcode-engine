import { Expression } from '@babel/types';
import generate from '@babel/generator';
import { IScope } from '../../../types';
import { parseExpressionConvertThis2Context } from '../../../utils/expressionParser';

/**
 * 将所有的 this.xxx 替换为 __$$context.xxx
 * @param expr
 */
export function transformThis2Context(
  expr: string | Expression,
  scope: IScope,
  { ignoreRootScope = false } = {},
): string {
  if (ignoreRootScope && scope.parent == null) {
    return typeof expr === 'string' ? expr : generate(expr).code;
  }

  // 下面这种字符串替换的方式虽然简单直接，但是对于复杂场景会误匹配，故后期改成了解析 AST 然后修改 AST 最后再重新生成代码的方式
  // return expr
  //   .replace(/\bthis\.item\./g, () => 'item.')
  //   .replace(/\bthis\.index\./g, () => 'index.')
  //   .replace(/\bthis\./g, () => '__$$context.');
  return parseExpressionConvertThis2Context(
    expr,
    '__$$context',
    scope.bindings?.getAllBindings() || [],
  );
}
