import lg from '@ali/vu-logger';
import { ComponentClass, ComponentType } from 'react';
import Prototype from './prototype';
import { ComponentMeta } from '@ali/lowcode-designer';
import { designer } from '../editor';

function basename(name: string) {
  return name ? (/[^\/]+$/.exec(name) || [''])[0] : '';
}

function getCamelName(name: string) {
  const words = basename(name)
    .replace(/^((vc)-)?(.+)/, '$3')
    .split('-');
  return words.reduce((s, word) => s + word[0].toUpperCase() + word.substring(1), '');
}

export interface ComponentProtoBundle {
  // @ali/vc-xxx
  name: string;
  componentName?: string;
  category?: string;
  module: Prototype | Prototype[];
}

export interface ComponentViewBundle {
  // @ali/vc-xxx
  name: string;
  // alias to property name
  componentName?: string;
  category?: string;
  module: ComponentType<any>;
}

export default class Bundle {
  static createPrototype = Prototype.create;
  static addGlobalPropsReducer = Prototype.addGlobalPropsReducer;
  static addGlobalPropsConfigure = Prototype.addGlobalPropsConfigure;
  static addGlobalExtraActions = Prototype.addGlobalExtraActions;
  static removeGlobalPropsConfigure = Prototype.removeGlobalPropsConfigure;
  static overridePropsConfigure = Prototype.overridePropsConfigure;
  static create(protos: ComponentProtoBundle[], views?: ComponentViewBundle[]) {
    return new Bundle(protos, views);
  }

  private viewsMap: { [componentName: string]: ComponentType } = {};
  private registry: { [componentName: string]: Prototype } = {};
  private prototypeList: Prototype[] = [];

  constructor(protos?: ComponentProtoBundle[], views?: ComponentViewBundle[]) {
    // 注册 prototypeView 视图
    if (views && Array.isArray(views)) {
      this.recursivelyRegisterViews(views);
    }
    protos?.forEach((item) => {
      const prototype = item.module;
      if (prototype instanceof Prototype) {
        this.revisePrototype(item, prototype);
        const componentName = item.componentName || prototype.getComponentName()!;
        const matchedView = this.viewsMap[componentName] || null;
        if (!prototype.getView() && matchedView) {
          prototype.setView(matchedView);
        }
        this.registerPrototype(prototype);
      } else if (Array.isArray(prototype)) {
        this.recursivelyRegisterPrototypes(prototype, item);
      }
    });
  }

  getFromMeta(componentName: string): Prototype {
    if (this.registry[componentName]) {
      return this.registry[componentName];
    }
    const meta = designer.getComponentMeta(componentName);
    const prototype = Prototype.create(meta);
    this.prototypeList.push(prototype);
    this.registry[componentName] = prototype;
    return prototype;
  }

  removeComponentBundle(componentName: string) {
    const cIndex = this.prototypeList.findIndex((proto) => proto.getComponentName() === componentName);
    delete this.registry[componentName];
    this.prototypeList.splice(cIndex, 1);
  }

  getList() {
    return this.prototypeList;
  }

  get(componentName: string) {
    return this.registry[componentName];
  }

  replacePrototype(componentName: string, cp: Prototype) {
    const view: any = this.get(componentName).getView();
    this.removeComponentBundle(componentName);
    this.registry[cp.getComponentName()!] = cp;
    this.prototypeList.push(cp);
    cp.setView(view);
  }

  private recursivelyRegisterViews(list: any[], viewName?: string): void {
    list.forEach((item: any) => {
      if (Array.isArray(item.module)) {
        return this.recursivelyRegisterViews(item.module, item.name);
      } else if (Array.isArray(item)) {
        return this.recursivelyRegisterViews(item, viewName);
      }
      let viewDetail: ComponentClass;
      if (item.module && typeof item.module === 'function') {
        viewDetail = item.module;
      } else {
        viewDetail = item;
      }
      if (!viewDetail.displayName) {
        lg.log('ERROR_NO_PROTOTYPE_VIEW');
        lg.error('WARNING: the package without displayName is', item);
        viewDetail.displayName = getCamelName(viewName || item.name);
      }
      (viewDetail as any)._packageName_ = viewName || item.name;
      this.viewsMap[viewDetail.displayName] = viewDetail;
    });
  }

  private recursivelyRegisterPrototypes(list: any[], cp: ComponentProtoBundle) {
    const propList: ComponentProtoBundle[] = list;
    propList.forEach((proto: ComponentProtoBundle, index: number) => {
      if (Array.isArray(proto)) {
        this.recursivelyRegisterPrototypes(proto, cp);
        return;
      }
      if (proto instanceof Prototype) {
        const componentName = proto.getComponentName()!;
        if (!proto.getView() && this.viewsMap[componentName]) {
          proto.setView(this.viewsMap[componentName]);
        }
        if (cp.name && !proto.getPackageName()) {
          proto.setPackageName(cp.name);
        }
        this.registerPrototype(proto);
      }
    });
  }

  private revisePrototype(item: ComponentProtoBundle, prototype: Prototype) {
    if (item.category) {
      prototype.setCategory(item.category);
    }
    if (item.name && !prototype.getPackageName()) {
      prototype.setPackageName(item.name);
    }
  }

  private registerPrototype(prototype: Prototype) {
    const componentName = prototype.getComponentName()!;
    if (this.registry[componentName]) {
      lg.warn('WARN: override prototype', prototype, componentName);
      const idx = this.prototypeList.findIndex((proto) => componentName === proto.getComponentName());
      this.prototypeList[idx] = prototype;
    } else {
      this.prototypeList.push(prototype);
    }
    this.registry[componentName] = prototype;
  }
}
