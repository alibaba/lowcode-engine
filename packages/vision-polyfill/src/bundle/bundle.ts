import lg from '@ali/vu-logger';
import { camelCase, find, findIndex, upperFirst } from 'lodash';
import { ComponentClass, ReactElement, ComponentType } from 'react';

import { UnknownComponent } from '../../ui/placeholders';
import Trunk, { IComponentBundle } from './trunk';
import Prototype from './prototype';

function basename(name: string) {
  return name ? (/[^\/]+$/.exec(name) || [''])[0] : '';
}

function getCamelName(name: string) {
  const words = basename(name).replace(/^((vc)-)?(.+)/, '$3').split('-');
  return words.reduce((s, word) => s + word[0].toUpperCase() + word.substring(1), '');
}

export declare interface IComponentProto {
  name: string;
  module: Prototype;
  componentName?: string;
  category?: string;
}

export default class Bundle {
  public static createPrototype = Prototype.create;
  public static addGlobalPropsReducer = Prototype.addGlobalPropsReducer;
  public static addGlobalPropsConfigure = Prototype.addGlobalPropsConfigure;
  public static addGlobalExtraActions = Prototype.addGlobalExtraActions;
  public static addGlobalNodeCanDragConfig = Prototype.addGlobalNodeCanDragConfig;
  public static removeGlobalPropsConfigure = Prototype.removeGlobalPropsConfigure;
  public static overridePropsConfigure = Prototype.overridePropsConfigure;
  public static create = function createBundle(
    components: Array<IComponentProto[] | IComponentProto>,
    views: IComponentBundle[], nameSpace: string) {
    return new Bundle(components, views, nameSpace);
  };

  /**
   * if all components are packed in a single package
   * the compositeBundle property shall be true
   */
  public compositeBundle: boolean = false;

  private trunk: Trunk;
  private nameSpace: string;
  private registry: { [name: string]: Prototype };
  private registryById: { [id: string]: Prototype };
  private prototypeList: Prototype[];

  private viewMap: { [viewName: string]: ComponentClass } = {};
  private viewList: ComponentClass[] = [];

  constructor(
    componentPrototypes: Array<IComponentProto | IComponentProto[]>,
    views: IComponentBundle[],
    nameSpace: string,
  ) {
    this.nameSpace = nameSpace || '';
    this.registry = {};
    this.registryById = {};
    this.prototypeList = [];
    this.trunk = new Trunk();

    if (Array.isArray(views)) {
      this.recursivelyRegisterViews(views);
    }
    componentPrototypes.forEach((item: IComponentProto) => {
      const prototype = item.module;
      if (prototype instanceof Prototype) {
        this.revisePrototype(item, prototype);
        const matchedView = this.viewMap[item.componentName || prototype.getComponentName()] || null;
        if (!prototype.getView() && matchedView) {
          prototype.setView(matchedView);
        }
        this.registerPrototype(prototype);
      } else if (Array.isArray(prototype)) {
        this.recursivelyRegisterPrototypes(prototype, item);
      }
    });
    this.prototypeList.forEach((p, idx) => {
      if (!p.getView()) {
        p.setView(UnknownComponent);
      }
    });
    // invoke prototype mocker while the prototype does not exist
    Object.keys(this.viewMap).forEach((viewName) => {
      if (!find(this.prototypeList, (proto) => proto.getComponentName() === viewName)) {
        const mockedPrototype = this.trunk.mockComponentPrototype(this.viewMap[viewName]);
        if (mockedPrototype) {
          if (!mockedPrototype.getPackageName()) {
            mockedPrototype.setPackageName((this.viewMap[viewName] as any)._packageName_);
          }
          this.registry[viewName] = mockedPrototype;
          this.registryById[mockedPrototype.getId()] = mockedPrototype;
          this.prototypeList.push(mockedPrototype);
        }
      }
    });
  }

  public addComponentBundle(bundles: Array<IComponentProto | IComponentBundle>): void;
  public addComponentBundle(bundles: any) {
    /**
     * Normal Component bundle: [ Prototype, PrototypeView ]
     * Component without Prototype.js: [ View ]
     */
    if (bundles.length >= 2) {
      const prototype = bundles[0];
      const prototypeView = bundles[1];
      prototype.setView(prototypeView);
      this.registerPrototype(prototype);
    } else if (bundles.length === 1) {
      // Mock a Prototype for DIY Component load from async build
      const proto = this.trunk.mockComponentPrototype(bundles[0]);
      if (!proto) {
        return;
      }
      if (!proto.getView()) {
        proto.setView(bundles[0]);
      }
      this.registerPrototype(proto);
    }
  }

  public removeComponentBundle(componentName: string) {
    const cIndex = findIndex(this.prototypeList, (proto) => proto.getComponentName() === componentName);
    const id = this.prototypeList[cIndex].getId();
    delete this.registryById[id];
    delete this.registry[componentName];
    this.prototypeList.splice(cIndex, 1);
  }

  public getNamespace() {
    return this.nameSpace;
  }

  public getList() {
    return this.prototypeList;
  }

  public get(componentName: string) {
    return this.registry[componentName];
  }

  public getById(id: string) {
    return this.registryById[id];
  }

  public isCompositeBundle() {
    return this.isCompositeBundle;
  }

  public filter(fn: (item: Prototype) => boolean) {
    this.prototypeList = this.prototypeList.filter((item) => {
      if (fn(item) === false) {
        if (this.registry[item.getComponentName()] === item) {
          delete this.registry[item.getComponentName()];
        }
        if (this.registryById[item.getId()] === item) {
          delete this.registryById[item.getId()];
        }
        return false;
      }
      return true;
    });
  }

  public replacePrototype(componentName: string, cp: Prototype) {
    const view: any = this.get(componentName).getView();
    this.removeComponentBundle(componentName);
    this.registry[cp.getComponentName()] = cp;
    this.registryById[cp.getId()] = cp;
    this.prototypeList.push(cp);
    cp.setView(view);
  }

  private recursivelyRegisterPrototypes(list: any[], cp: IComponentProto) {
    const propList: IComponentProto[] = list;
    propList.forEach((proto: IComponentProto, index: number) => {
      if (Array.isArray(proto)) {
        this.recursivelyRegisterPrototypes(proto, cp);
        return;
      }
      if (proto instanceof Prototype) {
        if (!proto.getView() && this.viewMap[proto.getComponentName()]) {
          proto.setView(this.viewMap[proto.getComponentName()]);
        }
        if (index === 0 && cp.componentName) {
          proto.setComponentName(cp.componentName);
        }
        if (cp.name && !proto.getPackageName()) {
          proto.setPackageName(cp.name);
        }
        this.registerPrototype(proto);
      }
    });
  }

  /**
   * register View
   * @param list ViewList
   * @param viewName
   */
  private recursivelyRegisterViews(list: IComponentBundle[], viewName?: string): void;
  private recursivelyRegisterViews(list: any[], viewName?: string): void {
    list.forEach((item: any) => {
      if (Array.isArray(item.module)) {
        return this.recursivelyRegisterViews(item.module, item.name);
      } else if (Array.isArray(item)) {
        this.compositeBundle = true;
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
        viewDetail.displayName = upperFirst(
          // mock componentName from packageName
          camelCase((viewName || item.name).split('-').slice(1).join('-')),
        );
      }
      (viewDetail as any)._packageName_ = viewName || item.name;
      this.viewMap[viewDetail.displayName] = viewDetail;
      this.viewList.push(viewDetail);
    });
  }

  private revisePrototype(item: IComponentProto, prototype: Prototype) {
    const name = item.name || item.componentName;
    if (item.category) {
      prototype.setCategory(item.category);
    }
    if (item.name && !prototype.getPackageName()) {
      prototype.setPackageName(item.name);
    }
    if (item.componentName) {
      prototype.setComponentName(item.componentName);
    }
    if (!prototype.getComponentName()) {
      prototype.setComponentName(getCamelName(name));
    }
  }

  private registerPrototype(prototype: Prototype) {
    if (this.registry[prototype.getComponentName()]) {
      lg.warn('WARN: override prototype', prototype, prototype.getComponentName());
      const idx = findIndex(this.prototypeList, (proto) =>
        prototype.getComponentName() === proto.getComponentName());
      this.prototypeList[idx] = prototype;
      delete this.registryById[prototype.getId()];
    } else {
      this.prototypeList.push(prototype);
    }
    this.registry[prototype.getComponentName()] = prototype;
    this.registryById[prototype.getId()] = prototype;
  }
}
