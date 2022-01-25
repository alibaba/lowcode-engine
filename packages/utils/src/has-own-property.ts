const prototypeHasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwnProperty(obj: any, key: string | number | symbol): boolean {
  return obj && prototypeHasOwnProperty.call(obj, key);
}
