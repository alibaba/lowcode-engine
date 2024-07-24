import { type Package, mapPackageToUniqueId } from '@alilc/lowcode-shared';

export class ResourceModel {
  private packagesRef: Package[] = [];
  private idToPackageMap: Map<string, Package> = new Map();
  private packageToLibraryMap: WeakMap<Package, any> = new WeakMap();

  addOne(pkg: Package): string {
    const id = mapPackageToUniqueId(pkg);

    if (!this.idToPackageMap.has(id)) {
      this.idToPackageMap.set(id, pkg);
      this.packagesRef.push(pkg);
    }

    return id;
  }

  add(packages: Package[]): string[] {
    const ids: string[] = [];

    for (const pkg of packages) {
      const id = this.addOne(pkg);
      if (id) ids.push(id);
    }

    return ids;
  }

  getById(id: string): Package | undefined {
    return this.idToPackageMap.get(id);
  }

  has(id: string): boolean {
    return this.idToPackageMap.has(id);
  }

  getPackages(): Package[] {
    return [...this.packagesRef];
  }

  delete(id: string): void {
    const pkg = this.idToPackageMap.get(id);
    if (pkg) {
      this.packagesRef = this.packagesRef.filter((p) => p !== pkg);
      this.packageToLibraryMap.delete(pkg);
      this.idToPackageMap.delete(id);
    }
  }

  setPackageLibrary(id: string, library: any): void {
    // 转换成内部的引用
    const refedPackage = this.idToPackageMap.get(id);
    if (refedPackage) this.packageToLibraryMap.set(refedPackage, library);
  }

  getPackageLibrary<T = any>(id: string): T | undefined {
    const refedPackage = this.idToPackageMap.get(id);
    if (refedPackage) return this.packageToLibraryMap.get(refedPackage);
  }
}
