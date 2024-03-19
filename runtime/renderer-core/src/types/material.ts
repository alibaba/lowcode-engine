import { Package } from './specs/asset-spec';
import { Project, ComponentMap } from './specs/lowcode-spec';

export interface ProCodeComponent extends Package {
  package: string;
  type: 'proCode';
}

export interface LowCodeComponent extends Package {
  id: string;
  type: 'lowCode';
  componentName: string;
  schema: Project;
}
