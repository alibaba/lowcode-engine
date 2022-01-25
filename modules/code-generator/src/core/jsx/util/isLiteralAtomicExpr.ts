/**
 * 判断是否是原子类型的表达式
 */
export function isLiteralAtomicExpr(expr: string): boolean {
  return (
    expr === 'null' ||
    expr === 'undefined' ||
    expr === 'true' ||
    expr === 'false' ||
    /^-?\d+(\.\d+)?$/.test(expr)
  );
}
