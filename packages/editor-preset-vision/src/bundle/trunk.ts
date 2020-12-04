import { ReactElement, ComponentType } from 'react';
import { EventEmitter } from 'events';
import { registerSetter, RegisteredSetter, getSetter } from '@ali/lowcode-editor-core';
import lg from '@ali/vu-logger';
import { CustomView } from '@ali/lowcode-types';
import Bundle from './bundle';
import Prototype from './prototype';

export class Trunk {
  private trunk: any[] = [];

  private emitter: EventEmitter = new EventEmitter();

  private metaBundle = new Bundle();

  private componentPrototypeMocker: any;

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
    const list = this.trunk.filter(o => o).reduceRight((prev, cur) => prev.concat(cur.getList()), []);
    const result: Prototype[] = [];
    list.forEach((item: Prototype) => {
      if (!result.find(r => r.options.componentName === item.options.componentName)) {
        result.push(item);
      }
    });
    return result;
  }

  getPrototype(name: string) {
    let i = this.trunk.length;
    let bundle;
    let prototype;
    while (i-- > 0) {
      bundle = this.trunk[i];
      prototype = bundle.get(name);
      if (prototype) {
        return (prototype.meta as any).prototype;
      }
    }
    return this.metaBundle.getFromMeta(name);
  }

  getPrototypeById(id: string) {
    return this.getPrototype(id);
  }

  listByCategory() {
    const categories: any[] = [];
    const categoryMap: any = {};
    const categoryItems: any[] = [];
    const defaultCategory = {
      items: categoryItems,
      name: '*',
    };
    categories.push(defaultCategory);
    categoryMap['*'] = defaultCategory;
    this.getList().forEach((prototype) => {
      const cat = prototype.getCategory();
      if (!cat) {
        return;
      }
      if (!categoryMap.hasOwnProperty(cat)) {
        const categoryMapItems: any[] = [];
        categoryMap[cat] = {
          items: categoryMapItems,
          name: cat,
        };
        categories.push(categoryMap[cat]);
      }
      categoryMap[cat].items.push(prototype);
    });
    return categories;
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
    registerSetter(type, setter);
  }

  beforeLoadBundle() {
    console.warn('Trunk.beforeLoadBundle is deprecated');
  }

  afterLoadBundle() {
    console.warn('Trunk.afterLoadBundle is deprecated');
  }

  registerComponentPrototypeMocker(mocker: any) {
    this.componentPrototypeMocker = mocker;
  }

  mockComponentPrototype(bundle: any) {
    if (!this.componentPrototypeMocker) {
      lg.error('ERROR: no component prototypeMocker is set');
    }
    return this.componentPrototypeMocker
      && this.componentPrototypeMocker.mockPrototype(bundle);
  }

  setPackages() {
    console.warn('Trunk.setPackages is deprecated');
  }

  getSetter(type: string): any {
    const setter = getSetter(type);
    if (setter?.component) {
      return setter.component;
    }
    return setter;
  }

  getRecents(limit: number) {
    return this.getList().filter((prototype) => prototype.getCategory()).slice(0, limit);
  }
}

export default new Trunk();
