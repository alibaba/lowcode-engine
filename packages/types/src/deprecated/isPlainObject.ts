/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isPlainObject(value: any): value is Record<string, unknown> {
  if (typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null;
}
