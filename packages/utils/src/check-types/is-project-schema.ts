import { ProjectSchema } from '@alilc/lowcode-types';

export function isProjectSchema(data: any): data is ProjectSchema {
  return data && data.componentsTree;
}
