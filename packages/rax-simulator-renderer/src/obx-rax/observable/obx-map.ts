import Obx, { ObxFlag } from './obx';
import { patchMutator, patchAccessor } from './obx-set';
import { setPrototypeOf } from '../../utils/set-prototype-of';

type MapType = Map<PropertyKey, any>;

export default class ObxMap extends Obx<MapType> {
  constructor(name: string, target: MapType, obxFlag: ObxFlag = ObxFlag.DEEP) {
    super(name, target, obxFlag);

    setPrototypeOf(target, mapMethods);
  }

  has(key: PropertyKey) {
    return this.target.has(key);
  }

  set(key: PropertyKey, val: any) {
    this.target.set(key, val);
  }

  get(key: PropertyKey) {
    return this.target.get(key);
  }

  del(key: PropertyKey) {
    this.target.delete(key);
  }
}

// ======= Map ========
const mapProto = Map.prototype;
const mapMethods = Object.create(mapProto);

patchMutator(['set', 'clear', 'delete'], mapProto, mapMethods);

patchAccessor(['values', 'entries', Symbol.iterator, 'forEach', 'get'], mapProto, mapMethods);
