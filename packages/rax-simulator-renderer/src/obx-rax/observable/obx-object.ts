import { walk } from '../utils';
import { supportProxy, createProxy, getProxiedValue, SYMBOL_PROXY, SYMBOL_RAW } from './proxy';
import Obx, { getObx, SYMBOL_OBX, ObxFlag } from './obx';
import { defineObxProperty, ensureObxProperty } from './obx-property';
import { hasOwnProperty } from '../../utils/has-own-property';

function propFlag(flag: ObxFlag) {
  return flag === ObxFlag.DEEP ? ObxFlag.DEEP : flag - 1;
}

export default class ObxObject extends Obx<object> {
  constructor(name: string, target: object, obxFlag: ObxFlag = ObxFlag.DEEP) {
    super(name, target, obxFlag);

    if (supportProxy) {
      this.target = createProxy(target, objectProxyTraps);
    } else if (obxFlag > ObxFlag.REF) {
      walk(target as any, (obj, key, val) => {
        defineObxProperty(obj, key, val, undefined, propFlag(obxFlag));
      });
    }
  }

  set(key: PropertyKey, val: any) {
    const target = this.target;
    if (key in target && !(key in objectProto)) {
      (target as any)[key] = val;
      return;
    }

    super.set(key, val);
  }
}

const objectProto = Object.prototype;

const objectProxyTraps: ProxyHandler<any> = {
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
    if (name === SYMBOL_OBX || name === SYMBOL_PROXY || name in objectProto) {
      return rawTarget[name];
    }

    if (hasOwnProperty(rawTarget, name)) {
      const obx = getObx(rawTarget);
      if (obx) {
        ensureObxProperty(rawTarget, name, propFlag(obx.obxFlag));
      }
    }

    return getProxiedValue(rawTarget[name]);
  },
  set(rawTarget, name: PropertyKey, value: any) {
    if (name === SYMBOL_OBX || name === SYMBOL_PROXY || name in objectProto) {
      return false;
    }

    if (!hasOwnProperty(rawTarget, name)) {
      const obx = getObx(rawTarget);
      if (obx) {
        defineObxProperty(rawTarget, name, value, undefined, propFlag(obx.obxFlag));
        obx.reportChange();
        return true;
      }
    }

    rawTarget[name] = value;
    return true;
  },
  deleteProperty(rawTarget, name: PropertyKey) {
    if (name === SYMBOL_OBX || name === SYMBOL_PROXY || !hasOwnProperty(rawTarget, name)) {
      return false;
    }

    delete rawTarget[name];
    const obx = getObx(rawTarget);
    if (obx) {
      obx.reportChange();
    }
    return true;
  },
  preventExtensions() {
    return false;
  },
};
