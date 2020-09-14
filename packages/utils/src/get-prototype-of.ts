export function getPrototypeOf(target: any) {
  if (typeof Object.getPrototypeOf !== 'undefined') {
    return Object.getPrototypeOf(target);
  }

  // eslint-disable-next-line no-proto
  return target.__proto__;
}
