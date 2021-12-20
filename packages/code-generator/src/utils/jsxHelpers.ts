/**
 * 去掉 JS 表达式的 "{...}" 的封装, 如:
 *  {<xxx />} => <xxx />
 */
export function unwrapJsExprQuoteInJsx(jsxExpr: string): string {
  if (jsxExpr.length >= 2 && jsxExpr[0] === '{' && jsxExpr[jsxExpr.length - 1] === '}') {
    return jsxExpr.slice(1, jsxExpr.length - 1);
  }

  return jsxExpr;
}
