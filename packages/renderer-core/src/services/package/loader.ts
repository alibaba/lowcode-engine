import { type Package } from '@alilc/lowcode-shared';
import { type IPackageManagementService } from './managementService';

export interface PackageLoader {
  name?: string;
  load(this: IPackageManagementService, info: Package): Promise<any>;
  active(info: Package): boolean;
}

export function definePackageLoader(loader: PackageLoader) {
  return loader;
}
