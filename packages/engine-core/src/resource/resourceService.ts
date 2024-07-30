import {
  createDecorator,
  type Package,
  type Reference,
  mapPackageToUniqueId,
  exportByReference,
} from '@alilc/lowcode-shared';
import { ResourceModel } from './resourceModel';

export interface IResourceService {
  loadPackage(schema: Package): Promise<void>;

  loadPackages(schemas: Package[]): Promise<void>;

  getByReference<T = any>(reference: Reference): T | undefined;

  getPackages(idOrName: string): Package[] | undefined;

  getAllPackages(): Package[];
}

export const IResourceService = createDecorator<IResourceService>('resourceService');

export class ResourceService implements IResourceService {
  private resourceModel = new ResourceModel();

  loadPackage(pkg: Package): Promise<void> {
    return this.loadPackages([pkg]);
  }

  async loadPackages(packags: Package[]): Promise<void> {}

  getByReference<T = any>(reference: Reference): T | undefined {
    const id = mapPackageToUniqueId(reference);
    const library = this.resourceModel.getPackageLibrary<T>(id);

    return exportByReference(library, reference);
  }

  getPackages(idOrName: string): Package[] | undefined {
    return this.resourceModel
      .getPackages()
      .filter((pkg) => pkg.id === idOrName || pkg.package === idOrName);
  }

  getAllPackages(): Package[] {
    return this.resourceModel.getPackages();
  }
}
