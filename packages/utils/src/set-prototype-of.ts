export function setPrototypeOf(target: any, proto: any) {
  if (typeof Object.setPrototypeOf !== 'undefined') {
    Object.setPrototypeOf(target, proto);
  } else {
    // eslint-disable-next-line no-proto
    target.__proto__ = proto;
  }
}
