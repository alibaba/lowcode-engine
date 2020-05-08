import { NodePath, Path } from 'ast-types';

export interface IFileMeta {
  src: string;
  path: string;
  exports: IDefinitionMeta[];
}

export interface IDefinitionMeta {
  subDefinitions: IDefinitionMeta[];
  nodePath: typeof Path;
  exportName: string;
  id: string;
}
