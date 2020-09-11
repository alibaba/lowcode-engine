export function isObject(value: any): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
