import { Package } from './specs/asset-spec';
import { ComponentTree } from './specs/lowcode-spec';

export interface ProCodeComponent extends Package {
  package: string;
  type: 'proCode';
}

export interface LowCodeComponent extends Omit<Package, 'schema'> {
  id: string;
  type: 'lowCode';
  componentName: string;
  schema: ComponentTree;
}
