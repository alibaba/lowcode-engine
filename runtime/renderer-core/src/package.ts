import { type Package, type ComponentMap, type LowCodeComponent } from './types';

const packageStore: Map<string, any> = ((window as any).__PACKAGE_STORE__ ??= new Map());

export interface PackageLoader {
  name?: string;
  load(packageInfo: Package, thisManager: PackageManager): Promise<any>;
  active(packageInfo: Package): boolean;
}

export interface PackageManager {
  /**
   * 新增资产包
   * @param packages
   */
  addPackages(packages: Package[]): Promise<void>;
  /** 通过包名获取资产包信息 */
  getPackageInfo(packageName: string): Package | undefined;
  getLibraryByPackageName(packageName: string): any;
  setLibraryByPackageName(packageName: string, library: any): void;
  /** 新增资产包加载器 */
  addPackageLoader(loader: PackageLoader): void;

  /** 解析组件映射 */
  resolveComponentMaps(componentMaps: ComponentMap[]): void;
  /** 获取组件映射对象，key = componentName value = component */
  getComponentsNameRecord<C = unknown>(componentMaps?: ComponentMap[]): Record<string, C>;
  /** 通过组件名获取对应的组件  */
  getComponent<C = unknown>(componentName: string): C | undefined;
  /** 注册组件 */
  registerComponentByName(componentName: string, Component: unknown): void;
}

export function createPackageManager(): PackageManager {
  const packageLoaders: PackageLoader[] = [];
  const componentsRecord: Record<string, any> = {};

  const packagesRef: Package[] = [];

  async function addPackages(packages: Package[]) {
    for (const item of packages) {
      if (!item.package && !item.id) continue;

      const newId = item.package ?? item.id!;
      const isExist = packagesRef.some((_) => {
        const itemId = _.package ?? _.id;
        return itemId === newId;
      });

      if (!isExist) {
        packagesRef.push(item);

        if (!packageStore.has(newId)) {
          const loader = packageLoaders.find((loader) => loader.active(item));
          if (!loader) continue;

          try {
            const result = await loader.load(item, manager);
            if (result) packageStore.set(newId, result);
          } catch (e) {
            throw e;
          }
        }
      }
    }
  }

  function getPackageInfo(packageName: string) {
    return packagesRef.find((p) => p.package === packageName);
  }

  function getLibraryByPackageName(packageName: string) {
    const packageInfo = getPackageInfo(packageName);

    if (packageInfo) {
      return packageStore.get(packageInfo.package ?? packageInfo.id!);
    }
  }

  function setLibraryByPackageName(packageName: string, library: any) {
    packageStore.set(packageName, library);
  }

  function resolveComponentMaps(componentMaps: ComponentMap[]) {
    for (const map of componentMaps) {
      if (map.devMode === 'lowCode') {
        const packageInfo = packagesRef.find((_) => {
          return _.id === (map as LowCodeComponent).id;
        });

        if (packageInfo) {
          componentsRecord[map.componentName] = packageInfo;
        }
      } else {
        if (packageStore.has(map.package!)) {
          const library = packageStore.get(map.package!);
          // export { exportName } from xxx exportName === global.libraryName.exportName
          // export exportName from xxx exportName === global.libraryName.default || global.libraryName
          // export { exportName as componentName } from package
          // if exportName == null exportName === componentName;
          // const componentName = exportName.subName, if exportName empty subName donot use
          const paths = map.exportName && map.subName ? map.subName.split('.') : [];
          const exportName = map.exportName ?? map.componentName;

          if (map.destructuring) {
            paths.unshift(exportName);
          }

          let result = library;
          for (const path of paths) {
            result = result[path] || result;
          }

          const recordName = map.componentName ?? map.exportName;
          componentsRecord[recordName] = result;
        }
      }
    }
  }

  function getComponentsNameRecord(componentMaps?: ComponentMap[]) {
    if (componentMaps) {
      resolveComponentMaps(componentMaps);
    }

    return { ...componentsRecord };
  }

  function getComponent(componentName: string) {
    return componentsRecord[componentName];
  }

  function registerComponentByName(componentName: string, Component: unknown) {
    componentsRecord[componentName] = Component;
  }

  const manager: PackageManager = {
    addPackages,
    getPackageInfo,
    getLibraryByPackageName,
    setLibraryByPackageName,
    addPackageLoader(loader) {
      if (!loader.name || !packageLoaders.some((_) => _.name === loader.name)) {
        packageLoaders.push(loader);
      }
    },

    resolveComponentMaps,
    getComponentsNameRecord,
    getComponent,
    registerComponentByName,
  };

  return manager;
}
