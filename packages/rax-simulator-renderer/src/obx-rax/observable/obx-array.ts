import { addHiddenProp } from '../utils';
import { observeIterable, reportChildValue } from './observable';
import { supportProxy, isProxied, createProxy, SYMBOL_PROXY, SYMBOL_RAW, getProxiedValue, getRawValue } from './proxy';
import Obx, { getObx, SYMBOL_OBX, ObxFlag } from './obx';
import { setPrototypeOf } from '../../utils/set-prototype-of';

export function childFlag(flag: ObxFlag) {
  return flag === ObxFlag.DEEP ? ObxFlag.DEEP : ObxFlag.VAL;
}

function isValidArrayIndex(val: any, limit: number = -1): boolean {
  const n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val) && (limit < 0 || n < limit);
}

export default class ObxArray extends Obx<any[]> {
  constructor(name: string, target: any[], obxFlag: ObxFlag = ObxFlag.DEEP) {
    super(name, target, obxFlag);

    if (supportProxy) {
      this.target = createProxy(target, arrayProxyTraps);
    } else if (obxFlag > ObxFlag.VAL) {
      observeIterable(target, childFlag(obxFlag));
    }
    setPrototypeOf(target, arrayMethods);
  }

  set(key: PropertyKey, val: any) {
    const target = this.target;
    if (isValidArrayIndex(key)) {
      const index = Number(key);
      target.length = Math.max(target.length, index);
      target.splice(index, 1, val);
      return;
    }
    super.set(key, val);
  }

  del(key: PropertyKey) {
    if (isValidArrayIndex(key, this.target.length)) {
      this.target.splice(Number(key), 1);
      return;
    }
    super.del(key);
  }
}

// ======= patches ========
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  const original = (arrayProto as any)[method];
  addHiddenProp(arrayMethods, method, function mutator(this: any[], ...args: any[]) {
    const obx = getObx(this) as ObxArray;
    const proxied = isProxied(this);
    const length = this.length;
    // apply to rawTarget avoid to call Proxy.set
    const result = original.apply(getRawValue(this), args);

    let changed = true;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        changed = inserted.length > 0;
        break;
      case 'splice':
        inserted = args.slice(2);
        changed = inserted.length > 0 || this.length !== length;
        break;
      case 'pop':
      case 'shift':
        changed = this.length !== length;
        break;
    }
    if (!proxied && obx.obxFlag > ObxFlag.VAL) {
      if (inserted && inserted.length > 0) {
        observeIterable(inserted, childFlag(obx.obxFlag));
      }
    }

    if (obx && changed) {
      obx.reportChange();
    }
    return result;
  });
});

const arrayProxyTraps: ProxyHandler<any[]> = {
  has(rawTarget, name: PropertyKey) {
    if (name === SYMBOL_OBX || name === SYMBOL_RAW) {
      return true;
    }
    return name in rawTarget;
  },
  get(rawTarget, name: PropertyKey) {
    if (name === SYMBOL_RAW) {
      return rawTarget;
    }
    if (name === SYMBOL_OBX || name === SYMBOL_PROXY || name in arrayMethods) {
      return (rawTarget as any)[name];
    }

    if (isValidArrayIndex(name)) {
      const v = rawTarget[Number(name)];
      const obx = getObx(rawTarget);
      if (obx) {
        reportChildValue(v, obx.obxFlag);
      }
      return getProxiedValue(v);
    }

    return getProxiedValue((rawTarget as any)[name]);
  },
  set(rawTarget, name: PropertyKey, value: any) {
    if (name === 'length') {
      rawTarget[name] = value;
      return true;
    }
    if (name === SYMBOL_OBX || name === SYMBOL_PROXY || name in arrayMethods) {
      return false;
    }

    if (isValidArrayIndex(name)) {
      const index = Number(name);
      rawTarget.length = Math.max(rawTarget.length, index);
      rawTarget.splice(index, 1, value);
      return true;
    }

    (rawTarget as any)[name] = value;
    return true;
  },
  deleteProperty(rawTarget, name: PropertyKey) {
    if (name === SYMBOL_OBX || name === SYMBOL_PROXY || name in arrayMethods) {
      return false;
    }

    if (isValidArrayIndex(name)) {
      rawTarget.splice(Number(name), 1);
      return true;
    }

    delete (rawTarget as any)[name];
    return true;
  },
  preventExtensions() {
    return false;
  },
};
