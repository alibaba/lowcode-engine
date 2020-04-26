export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object';
}
