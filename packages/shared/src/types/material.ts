import { Package } from './specs/asset-spec';
import { ComponentTreeRoot } from './specs/lowcode-spec';

export interface ProCodeComponent extends Package {
  package: string;
  type: 'proCode';
  library: string;
}

export interface LowCodeComponent extends Package {
  id: string;
  type: 'lowCode';
  componentName: string;
  schema: ComponentTreeRoot;
}
