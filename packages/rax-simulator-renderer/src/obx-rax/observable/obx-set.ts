import { addHiddenProp } from '../utils';
import Obx, { getObx, ObxFlag } from './obx';
import { reportChildValue } from './observable';
import { getProxiedValue } from './proxy';
import { setPrototypeOf } from '../../utils/set-prototype-of';

type SetType = Set<any> | WeakSet<any>;

export default class ObxSet extends Obx<SetType> {
  constructor(name: string, target: SetType, obxFlag: ObxFlag = ObxFlag.DEEP) {
    super(name, target, obxFlag);

    setPrototypeOf(target, target instanceof Set ? setMethods : weaksetMethods);
  }

  has(key: PropertyKey) {
    return false;
  }

  set(key: PropertyKey, val: any) {}

  get(key: PropertyKey) {
    return undefined;
  }

  del(key: PropertyKey) {}
}

function isIterator(v: any): v is Iterator<any> {
  return v.next ? true : false;
}

export function patchAccessor(keys: Array<string | symbol>, proto: any, methods: object): void {
  keys.forEach(method => {
    const original = proto[method];
    addHiddenProp(methods, method, function accessor(this: any, ...args: any[]) {
      const obx = getObx(this);
      const flag = obx ? obx.obxFlag : ObxFlag.REF;
      if (method === 'forEach') {
        const fn = args[0];
        const thisArg = args[0] || this;
        args[0] = (v: any, a: any, c: any) => {
          reportChildValue(v, flag);
          return fn.call(thisArg, getProxiedValue(v), a, c);
        };
        return original.apply(this, args);
      }

      const result = original.apply(this, args);

      if (method === 'get') {
        reportChildValue(result, flag);
        return getProxiedValue(result);
      }

      if (isIterator(result)) {
        const originNext = result.next;
        const isMapIter = String(result) === '[object Map Iterator]';
        const isEntries = method === 'entries';
        let keys: string[] | null = null;
        if (isEntries && !isMapIter) {
          keys = ['0', '1'];
        } else if (isMapIter && (isEntries || method === Symbol.iterator)) {
          keys = ['1'];
        }

        result.next = function next() {
          let n = originNext.call(this);
          if (!n.done) {
            if (keys) {
              n.value = createResultProxy(n.value, flag, keys);
            } else {
              n = createResultProxy(n, flag);
            }
          }
          return n;
        };
      }

      return result;
    });
  });
}

function createResultProxy(entries: any, flag: ObxFlag, keys: any[] = ['value']) {
  return new Proxy(entries, {
    get(target, key) {
      const v = target[key];
      if (v && keys.includes(key)) {
        reportChildValue(v, flag);
      }
      return getProxiedValue(v);
    },
  });
}

export function patchMutator(keys: Array<string | symbol>, proto: any, methods: object): void {
  keys.forEach(method => {
    const original = proto[method];
    addHiddenProp(methods, method, function mutator(this: any, ...args: any[]) {
      const size = this.size;
      const result = original.apply(this, args);
      const obx = getObx(this);
      let changed = true;
      switch (method) {
        case 'add':
        case 'clear':
        case 'delete':
          changed = this.size !== size;
          break;
      }
      // now: "set" not compare values, default changed
      if (obx && changed) {
        obx.reportChange();
      }
      return result;
    });
  });
}

// ======= Set ========
const setProto = Set.prototype;
const setMethods = Object.create(setProto);

patchMutator(['add', 'clear', 'delete'], setProto, setMethods);

patchAccessor(['values', 'keys', 'entries', 'forEach', Symbol.iterator], setProto, setMethods);

// ======= WeakSet ========
const weaksetProto = WeakSet.prototype;
const weaksetMethods = Object.create(weaksetProto);

patchMutator(['add', 'delete', 'clear'], weaksetProto, weaksetMethods);
