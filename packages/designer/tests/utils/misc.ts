import lodashSet from 'lodash/set';

export function set(obj: any, path: any, val: any) {
  if (typeof path === 'string' && path.startsWith('prototype')) {
    const segs = path.split('.');
    let acc = obj;
    segs.forEach((seg, idx) => {
      if (idx !== segs.length - 1) {
        acc[seg] = acc[seg] || {};
        acc = acc[seg];
      } else {
        acc[seg] = val;
      }
    });
  }
  return lodashSet(obj, path, val);
}

export function delay(ms) {
  return new Promise(resove => setTimeout(resove, ms));
}

export function delayObxTick() {
  return delay(100);
}
