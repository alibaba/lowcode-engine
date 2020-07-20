import { walk, addHiddenFinalProp, nextId } from '../utils';
import { defineObxProperty } from './obx-property';
import { IObservable, propagateChanged, startBatch, endBatch } from './observable';
import { IDerivation, DerivationState, clearObserving } from '../derivation';
import { hasOwnProperty } from '../utils/has-own-property';
import { splitPath } from '../utils/split-path';

export enum ObxFlag {
  REF = 0,
  VAL = 1,
  SHALLOW = 2,
  DEEP = 3,
}

class Obx<T = any[] | object> implements IObservable, IDerivation {
  id = nextId();
  localVer = 0;
  observing: IObservable[] = [];
  observers = new Set<IDerivation>();
  dependenciesState = DerivationState.NOT_TRACKING;
  lowestObserverState = DerivationState.UP_TO_DATE;

  constructor(public name: string, public target: T, public obxFlag: ObxFlag = ObxFlag.DEEP) {}

  onBecomeDirty() {
    propagateChanged(this);
  }

  onBecomeUnobserved() {
    clearObserving(this);
  }

  reportChange(force = false) {
    startBatch();
    this.localVer++;
    propagateChanged(this, force);
    endBatch();
  }

  // TODO: remove this unused function, move to utils $getAsObx
  getAsObx(path: PropertyKey): Obx<T | any[] | object> | void {
    if (path === '') {
      return this;
    }

    let entry = path;
    let nestPath = '';

    if (typeof path === 'string') {
      const pathArray = splitPath(path);

      if (!pathArray) {
        return this;
      }

      entry = pathArray[1];
      nestPath = pathArray[2];
    }

    if (!entry) {
      return this.get(nestPath);
    }

    let ret = this.get(entry);

    if (!hasObx(ret) && nestPath) {
      ret = this.get(path);
    }

    const obx = getObx(ret);

    if (obx && nestPath) {
      return obx.getAsObx(nestPath);
    }

    return obx;
  }

  has(key: PropertyKey): boolean {
    if (key == null || key === '') {
      return false;
    }

    return key in this.target;
  }

  get(key?: PropertyKey): any {
    if (key == null || key === '') {
      return this.target;
    }

    return (this.target as any)[key];
  }

  set(key: PropertyKey, val: any): void {
    if (this.obxFlag > ObxFlag.REF) {
      defineObxProperty(this.target as any, key, val, undefined, this.obxFlag);
    } else {
      (this.target as any)[key] = val;
    }

    this.reportChange();
  }

  del(key: PropertyKey) {
    if (!hasOwnProperty(this.target, key)) {
      return;
    }

    delete (this.target as any)[key];
    this.reportChange();
  }

  extend(properties: object) {
    startBatch();
    walk(properties, (_, key, val) => this.set(key, val));
    endBatch();
  }
}

export default Obx;

export const SYMBOL_OBX = Symbol.for('obx');
export function injectObx(obj: any[] | object, obx: Obx): void {
  addHiddenFinalProp(obj, SYMBOL_OBX, obx);
}

export function getObx(obj: any): Obx | undefined {
  return obj ? (obj as any)[SYMBOL_OBX] : undefined;
}

export function hasObx(obj: any[] | object): boolean {
  return hasOwnProperty(obj, SYMBOL_OBX) && (obj as any)[SYMBOL_OBX] instanceof Obx;
}

export function reportChange(obj: any, force = false) {
  const obx = getObx(obj);
  if (obx) {
    obx.reportChange(force);
  }
}
