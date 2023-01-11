
export function isJSFunction(x: any): boolean {
  return typeof x === 'object' && x && x.type === 'JSFunction';
}
