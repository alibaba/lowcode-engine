export function getPrototypeOf(target: any) {
  if (typeof Object.getPrototypeOf !== 'undefined') {
    return Object.getPrototypeOf(target);
  }

  return target.__proto__;
}
