import {
  type Package,
  type LowCodeComponent,
  type ProCodeComponent,
  type ComponentMap,
  createDecorator,
  specTypes,
  exportByReference,
  mapPackageToUniqueId,
  type Reference,
  Disposable,
} from '@alilc/lowcode-shared';
import { get as lodashGet, differenceWith, isEqual } from 'lodash-es';
import { PackageLoader } from './package';
import { ISchemaService } from '../schema';

export interface NormalizedPackage {
  id: string;
  package: string;
  library: string;
  exportSource?: NormalizedPackage | undefined;
  raw: ProCodeComponent;
}

export interface IPackageManagementService {
  /**
   * 新增资产包
   * @param packages
   */
  loadPackages(packages: Package[]): Promise<void>;
  /** 通过包名获取资产包信息 */
  getPackageInfo(packageName: string): Package | undefined;

  getModuleByReference<T = any>(reference: Reference): T | undefined;

  /** 解析组件映射 */
  resolveComponentMaps(componentMaps: ComponentMap[]): void;

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

export class PackageManagementService extends Disposable implements IPackageManagementService {
  private componentsRecord: Record<string, any> = {};

  private packageStore: Map<string, any> = ((window as any).__PACKAGE_STORE__ ??= new Map());

  private packagesMap: Map<string, NormalizedPackage> = new Map();

  private lowCodeComponentPackages: Map<string, LowCodeComponent> = new Map();

  private packageLoaders: PackageLoader[] = [];

  constructor(@ISchemaService private schemaService: ISchemaService) {
    super();

    this._addDispose(
      this.schemaService.onSchemaUpdate(({ key, previous, data }) => {
        if (key === 'componentsMap') {
          // todo: add remove ...
          const diff = differenceWith(data, previous, isEqual);
          if (diff.length > 0) this.resolveComponentMaps(diff);
        }
      }),
    );
  }

  async loadPackages(packages: Package[]) {
    for (const item of packages) {
      // low code component not need load
      if (specTypes.isLowCodeComponentPackage(item)) {
        this.lowCodeComponentPackages.set(item.id, item);
        continue;
      }

      if (!specTypes.isProCodeComponentPackage(item)) continue;

      const normalized = this.normalizePackage(item);
      await this.loadPackageByNormalized(normalized);
    }
  }

  getPackageInfo(packageName: string) {
    return this.packagesMap.get(packageName)?.raw;
  }

  getModuleByReference<T = any>(reference: Reference): T | undefined {
    const id = mapPackageToUniqueId(reference);
    if (this.packageStore.has(id)) {
      const library = this.packageStore.get(id);
      const result = exportByReference(library, reference);

      return result;
    }
  }

  resolveComponentMaps(componentMaps: ComponentMap[]) {
    for (const map of componentMaps) {
      if (map.devMode === 'lowCode') {
        const packageInfo = this.lowCodeComponentPackages.get((map as LowCodeComponent).id);

        if (map.componentName && packageInfo) {
          this.componentsRecord[map.componentName] = packageInfo;
        }
      } else {
        const result = this.getModuleByReference(map);
        if (result) {
          this.componentsRecord[map.componentName] = result;
        }
      }
    }
  }

  getComponent(componentName: string) {
    return lodashGet(this.componentsRecord, componentName);
  }

  registerComponentByName(componentName: string, Component: unknown) {
    this.componentsRecord[componentName] = Component;
  }

  addPackageLoader(loader: PackageLoader) {
    if (!loader.name || !this.packageLoaders.some((_) => _.name === loader.name)) {
      this.packageLoaders.push(loader);
    }
  }

  private normalizePackage(packageInfo: ProCodeComponent): NormalizedPackage {
    if (this.packagesMap.has(packageInfo.package)) {
      return this.packagesMap.get(packageInfo.package)!;
    }

    const normalized: NormalizedPackage = {
      package: packageInfo.package,
      id: mapPackageToUniqueId(packageInfo),
      library: packageInfo.library,
      raw: packageInfo,
    };

    this.packagesMap.set(normalized.id, normalized);

    // add normalized to package exports dependency graph
    const packagesRef = [...this.packagesMap.values()];

    // set export source
    if (packageInfo.exportSourceId || packageInfo.exportSourceLibrary) {
      const found = packagesRef.find((item) => {
        if (!packageInfo.exportSourceId) {
          return item.library === packageInfo.exportSourceLibrary;
        } else {
          return item.package === packageInfo.exportSourceId;
        }
      });

      if (found) {
        normalized.exportSource = found;
      }
    }

    return normalized;
  }

  private async loadPackageByNormalized(normalized: NormalizedPackage) {
    if (this.packageStore.has(normalized.id)) return;

    // if it has export source package, wait export source package loaded
    if (normalized.exportSource) {
      if (this.packageStore.has(normalized.id)) {
        const library = lodashGet(window, normalized.library);
        if (library) {
          this.packageStore.set(normalized.id, library);
        }
      }
    } else {
      const loader = this.packageLoaders.find((loader) => loader.active(normalized.raw));
      if (!loader) return;

      const result = await loader.load.call(this, normalized.raw);
      if (result) {
        this.packageStore.set(normalized.id, result);
      }
    }

    // if current package loaded, set the value of the dependency on this package
    if (this.packageStore.has(normalized.id)) {
      const chilren = [...this.packagesMap.values()].filter((item) => {
        return item.exportSource?.id === normalized.id;
      });

      for (const child of chilren) {
        await this.loadPackageByNormalized(child);
      }
    }
  }
}
