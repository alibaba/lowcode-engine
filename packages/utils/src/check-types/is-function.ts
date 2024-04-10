export function isFunction(obj: any): obj is Function {
  return obj && typeof obj === 'function';
}
