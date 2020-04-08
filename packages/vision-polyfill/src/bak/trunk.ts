import lg from '@ali/vu-logger';
import { EventEmitter } from 'events';
import { ComponentClass } from 'react';

import Bundle from '../bundle/bundle';
import Prototype, { setPackages } from '../bundle/prototype';
import Bus from '../bus';

interface IComponentInfo {
  image?: string;
  description?: string;
  componentDetail?: string;
  newVersion?: string;
}

interface IComponentLoader {
  load: (packageName: string, packageVersion: string, filePath?: string) => Promise<IComponentBundle>;
}

interface IComponentPrototypeMocker {
  mockPrototype: (bundle: ComponentClass) => Prototype;
}

interface IComponentBundle {
  // @ali/vc-xxx
  name: string;
  // alias to property name
  componentName?: string;
  category?: string;
  module: ComponentClass;
}

interface IComponentBundleLoadingConfig {
  isDIYComponent?: boolean;
  // need to emit 'trunk_change' event
  isSilence?: boolean;
  isNpmComponent?: boolean;
}

interface IComponentBundleConfigListItem {
  name: string;
  version: string;
  path?: string;
  // ac component in LeGao
  // FIXME: remove this logic out of Trunk in the future
  isDIYComponent?: boolean;
  // install comp directly from npm
  isNpmComponent?: boolean;
}

interface IBeforeLoad extends IComponentBundleLoadingConfig {
  name: string;
  version: string;
  path: string;
}

type beforeLoadFn = (loadingConfig: IBeforeLoad) => IBeforeLoad;
type afterLoadFn = (bundle: IComponentBundle, loadingConfig: IBeforeLoad) => IComponentBundle;

class Trunk {
  private trunk: any[];
  private list: any[];
  private emitter: EventEmitter;
  private componentBundleLoader: IComponentLoader;
  private componentPrototypeMocker: IComponentPrototypeMocker;

  private beforeLoad: beforeLoadFn;
  private afterLoad: afterLoadFn;

  constructor() {
    this.trunk = [];
    this.emitter = new EventEmitter();
    this.componentBundleLoader = null;
  }

  isReady() {
    return this.getList().length > 0;
  }

  addBundle(bundle: Bundle, bundleOptions: {
    before?: (bundle: Bundle) => Promise<Bundle>;
    after?: (bundle: Bundle) => any;
  } = {}) {
    // filter exsits
    bundle.filter((item) => {
      const componentName = item.getComponentName();
      if (componentName && this.getPrototype(componentName)) {
        return false;
      }
      return true;
    });
    if (bundleOptions.before) {
      bundleOptions.before.call(this, bundle).then((processedBundle: Bundle) => {
        this.trunk.push(processedBundle);
        this.emitter.emit('trunkchange');
      });
    } else {
      this.trunk.push(bundle);
      this.emitter.emit('trunkchange');
    }
    if (bundleOptions.after) {
      bundleOptions.after.call(this, bundle);
    }
  }

  /**
   * 注册组件信息加载器
   */
  registerComponentBundleLoader(loader: IComponentLoader) {
    // warn replacement method
    this.componentBundleLoader = loader;
  }

  registerComponentPrototypeMocker() {
    console.warn('Trunk.registerComponentPrototypeMocker is deprecated');
  }

  getBundle(nameSpace?: string): Bundle {
    console.warn('Trunk.getTrunk is deprecated');
    if (!nameSpace) {
      return this.trunk[0];
    }
    return find(this.trunk, (b: any) => b.getNamespace() === nameSpace);
  }

  public getList(): any[] {
    return this.list || this.trunk.reduceRight((prev, cur) => prev.concat(cur.getList()), []);
  }

  /**
   * 列出所有组件列表
   *
   */
  listByCategory() {
    console.warn('Trunk.listByCategory is deprecated');
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

  /**
   * 获取仓库
   *
   * @returns {Array}
   */
  getTrunk() {
    // legao-design 中有用
    console.warn('Trunk.getTrunk is deprecated');
    return this.trunk;
  }

  /**
   * 根据 componentName 查找对应的 prototype
   *
   * @param {string} componentName
   * @returns {Prototype}
   */
  getPrototype(componentName: string) {
    if (!componentName) {
      lg.error('ERROR: no component name found while get Prototype');
      return null;
    }
    const name = componentName.split('.');
    const namespace = name.length > 1 ? name[0] : '';
    let i = this.trunk.length;
    let bundle;
    let ns;
    let prototype;
    while (i-- > 0) {
      bundle = this.trunk[i];
      ns = bundle.getNamespace();
      if (ns === '' || namespace === ns) {
        prototype = bundle.get(componentName);
        if (prototype) {
          return prototype;
        }
      }
    }
    return null;
  }

  public getPrototypeById(id: string) {
    let i = this.trunk.length;
    let bundle;
    let prototype;
    while (i-- > 0) {
      bundle = this.trunk[i];
      prototype = bundle.getById(id);
      if (prototype) {
        return prototype;
      }
    }
    return null;
  }

  public getPrototypeView(componentName: string) {
    const prototype = this.getPrototype(componentName);
    return prototype ? prototype.getView() : null;
  }

  public loadComponentBundleList(componentBundleList: IComponentBundleConfigListItem[]) {
    Promise.all(componentBundleList.map((componentBundle) => {
      const { name, version, path, ...bundleContextInfo } = componentBundle;
      return this.loadComponentBundle(name, version, path, {
        ...bundleContextInfo,
        isDIYComponent: componentBundle.isDIYComponent,
        isSilence: true,
      });
    })).then((results) => {
      results.forEach((r: any) => this.getBundle().addComponentBundle(r));
      this.emitter.emit('trunkchange');
    });
  }

  public loadComponentBundle(
    name: string,
    version: string,
    path?: string,
    options?: IComponentBundleLoadingConfig) {
    const bundleList: IComponentBundle[] = [];
    return new Promise((resolve: any, reject: any) => {
      if (options && options.isDIYComponent) {
        let result: IBeforeLoad = { name, version, path, ...options };
        if (isFunction(this.beforeLoad)) {
          result = this.beforeLoad(result);
        }
        return this.componentBundleLoader.load(result.name, result.version, result.path)
          .then((b: IComponentBundle) => {
            if (isFunction(this.afterLoad)) {
              this.afterLoad(b, { name, path, version, ...options });
            }
            if (!options.isSilence) {
              this.getBundle().addComponentBundle([b]);
              this.emitter.emit('trunkchange');
            }
            resolve([b]);
          })
          .catch((e: Error) => {
            Bus.emit('ve.error.networkError', e);
            reject(e);
          });
      } else {
        this.componentBundleLoader.load(name, version, 'build/prototype.js')
          .then((b: IComponentBundle) => {
            bundleList.push(b);
            return this.componentBundleLoader.load(name, version, 'build/prototypeView.js');
          })
          .then((b: IComponentBundle) => {
            bundleList.push(b);
            if (!options.isSilence) {
              this.getBundle().addComponentBundle(bundleList);
              this.emitter.emit('trunkchange');
            }
            resolve(bundleList);
          })
          .catch((e: Error) => {
            Bus.emit('ve.error.networkError', e);
            reject(e);
          });
      }
    });
  }

  removeComponentBundle(name: string) {
    this.getBundle().removeComponentBundle(name);
    this.emitter.emit('trunkchange');
  }

  beforeLoadBundle(fn: beforeLoadFn) {
    this.beforeLoad = fn;
  }

  afterLoadBundle(fn: afterLoadFn) {
    this.afterLoad = fn;
  }

  onTrunkChange(func: () => any) {
    this.emitter.on('trunkchange', func);
    return () => {
      this.emitter.removeListener('trunkchange', func);
    };
  }

  setPackages(packages: Array<{ package: string; library: object | string }>) {
    setPackages(packages);
  }
}

export default new Trunk();
