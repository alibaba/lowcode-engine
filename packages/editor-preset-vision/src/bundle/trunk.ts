import { ReactElement, ComponentType } from 'react';
import { EventEmitter } from 'events';
import { registerSetter, RegisteredSetter } from '@ali/lowcode-editor-core';
import Bundle from './bundle';
import { CustomView } from '@ali/lowcode-types';

export class Trunk {
  private trunk: any[] = [];
  private emitter: EventEmitter = new EventEmitter();
  private metaBundle = new Bundle();

  isReady() {
    return this.getList().length > 0;
  }

  addBundle(bundle: Bundle) {
    this.trunk.push(bundle);
    this.emitter.emit('trunkchange');
  }

  getBundle(): Bundle {
    console.warn('Trunk.getBundle is deprecated');
    return this.trunk[0];
  }

  getList(): any[] {
    return this.trunk.reduceRight((prev, cur) => prev.concat(cur.getList()), []);
  }

  getPrototype(name: string) {
    let i = this.trunk.length;
    let bundle;
    let prototype;
    while (i-- > 0) {
      bundle = this.trunk[i];
      prototype = bundle.get(name);
      if (prototype) {
        return prototype;
      }
    }
    return this.metaBundle.getFromMeta(name);
  }

  getPrototypeView(componentName: string) {
    return this.getPrototype(componentName)?.getView();
  }

  onTrunkChange(func: () => any) {
    this.emitter.on('trunkchange', func);
    return () => {
      this.emitter.removeListener('trunkchange', func);
    };
  }

  registerSetter(type: string, setter: CustomView | RegisteredSetter) {
    console.warn('Trunk.registerSetter is deprecated');
    registerSetter(type, setter);
  }

  beforeLoadBundle() {
    console.warn('Trunk.beforeLoadBundle is deprecated');
  }

  afterLoadBundle() {
    console.warn('Trunk.afterLoadBundle is deprecated');
  }

  registerComponentPrototypeMocker() {
    console.warn('Trunk.registerComponentPrototypeMocker is deprecated');
  }

  setPackages() {
    console.warn('Trunk.setPackages is deprecated');
  }
}

export default new Trunk();
