/**
 *  内部版本 的 { type: 'JSExpression', source: '', value: '', extType: 'function' } 能力上等同于 JSFunction
 */
export function isInnerJsFunction(data: any) {
  return data && data.type === 'JSExpression' && data.extType === 'function';
}

export function isJSFunction(data: any): boolean {
  return typeof data === 'object' && data && data.type === 'JSFunction' || isInnerJsFunction(data);
}
