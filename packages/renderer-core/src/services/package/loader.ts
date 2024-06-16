import { type Spec } from '@alilc/lowcode-shared';
import { type IPackageManagementService } from './managementService';

export interface PackageLoader {
  name?: string;
  load(this: IPackageManagementService, info: Spec.Package): Promise<any>;
  active(info: Spec.Package): boolean;
}

export function definePackageLoader(loader: PackageLoader) {
  return loader;
}
