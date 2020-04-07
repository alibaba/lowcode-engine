export interface NpmInfo {
  componentName?: string;
  package: string;
  version: string;
  destructuring?: boolean;
  exportName?: string;
  subName?: string;
  main?: string;
}

export type ComponentsMap = NpmInfo[];
