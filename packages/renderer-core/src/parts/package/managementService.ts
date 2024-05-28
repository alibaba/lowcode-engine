import { type Spec, type LowCodeComponent, createDecorator, Provide } from '@alilc/lowcode-shared';
import { PackageLoader } from './loader';

export interface IPackageManagementService {
  /**
   * 新增资产包
   * @param packages
   */
  loadPackages(packages: Spec.Package[]): Promise<void>;
  /** 通过包名获取资产包信息 */
  getPackageInfo(packageName: string): Spec.Package | undefined;

  getLibraryByPackageName(packageName: string): any;

  setLibraryByPackageName(packageName: string, library: any): void;

  /** 解析组件映射 */
  resolveComponentMaps(componentMaps: Spec.ComponentMap[]): void;
  /** 获取组件映射对象，key = componentName value = component */
  getComponentsNameRecord<C = unknown>(
    componentMaps?: Spec.ComponentMap[],
  ): Record<string, C | LowCodeComponent>;
  /** 通过组件名获取对应的组件  */
  getComponent<C = unknown>(componentName: string): C | LowCodeComponent | undefined;
  /** 注册组件 */
  registerComponentByName(componentName: string, Component: unknown): void;

  /** 新增资产包加载器 */
  addPackageLoader(loader: PackageLoader): void;
}

export const IPackageManagementService = createDecorator<IPackageManagementService>(
  'packageManagementService',
);

@Provide(IPackageManagementService)
export class PackageManagementService implements IPackageManagementService {
  private componentsRecord: Record<string, any> = {};

  private packageStore: Map<string, any> = ((window as any).__PACKAGE_STORE__ ??= new Map());

  private packagesRef: Spec.Package[] = [];

  private packageLoaders: PackageLoader[] = [];

  async loadPackages(packages: Spec.Package[]) {
    for (const item of packages) {
      if (!item.package && !item.id) continue;

      const newId = item.package ?? item.id!;
      const isExist = this.packagesRef.some((_) => {
        const itemId = _.package ?? _.id;
        return itemId === newId;
      });

      if (!isExist) {
        this.packagesRef.push(item);

        if (!this.packageStore.has(newId)) {
          const loader = this.packageLoaders.find((loader) => loader.active(item));
          if (!loader) continue;

          const result = await loader.load.call(this, item);
          if (result) this.packageStore.set(newId, result);
        }
      }
    }
  }

  getPackageInfo(packageName: string) {
    return this.packagesRef.find((p) => p.package === packageName);
  }

  getLibraryByPackageName(packageName: string) {
    const packageInfo = this.getPackageInfo(packageName);

    if (packageInfo) {
      return this.packageStore.get(packageInfo.package ?? packageInfo.id!);
    }
  }

  setLibraryByPackageName(packageName: string, library: any) {
    this.packageStore.set(packageName, library);
  }

  resolveComponentMaps(componentMaps: Spec.ComponentMap[]) {
    for (const map of componentMaps) {
      if (map.devMode === 'lowCode') {
        const packageInfo = this.packagesRef.find((_) => {
          return _.id === (map as LowCodeComponent).id;
        });

        if (packageInfo) {
          this.componentsRecord[map.componentName] = packageInfo;
        }
      } else {
        if (this.packageStore.has(map.package!)) {
          const library = this.packageStore.get(map.package!);
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
          this.componentsRecord[recordName] = result;
        }
      }
    }
  }

  getComponentsNameRecord(componentMaps?: Spec.ComponentMap[]) {
    if (componentMaps) {
      const newMaps = componentMaps.filter((item) => !this.componentsRecord[item.componentName]);

      this.resolveComponentMaps(newMaps);
    }

    return { ...this.componentsRecord };
  }

  getComponent(componentName: string) {
    return this.componentsRecord[componentName];
  }

  registerComponentByName(componentName: string, Component: unknown) {
    this.componentsRecord[componentName] = Component;
  }

  addPackageLoader(loader: PackageLoader) {
    if (!loader.name || !this.packageLoaders.some((_) => _.name === loader.name)) {
      this.packageLoaders.push(loader);
    }
  }
}
