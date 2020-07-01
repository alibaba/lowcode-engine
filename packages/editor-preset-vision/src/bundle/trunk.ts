import { ReactElement, ComponentType } from 'react';
import { EventEmitter } from 'events';
import { registerSetter, RegisteredSetter, getSetter } from '@ali/lowcode-editor-core';
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
    const list = this.trunk.reduceRight((prev, cur) => prev.concat(cur.getList()), []);
    return Array.from(new Set(list));
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
    // console.warn('Trunk.registerSetter is deprecated');
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

  getSetter(type: string): any{
    const setter = getSetter(type);
    if (setter?.component) {
      return setter.component;
    }
    return setter;
  }
}

export default new Trunk();
