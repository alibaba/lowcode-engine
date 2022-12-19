import { ProjectSchema } from '../schema';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isProjectSchema(data: any): data is ProjectSchema {
  return data && data.componentsTree;
}
