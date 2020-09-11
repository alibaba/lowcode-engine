export function setPrototypeOf(target: any, proto: any) {
  // tslint:disable-next-line
  if (typeof Object.setPrototypeOf !== 'undefined') {
    Object.setPrototypeOf(target, proto); // tslint:disable-line
  } else {
    // eslint-disable-next-line no-proto
    target.__proto__ = proto;
  }
}
