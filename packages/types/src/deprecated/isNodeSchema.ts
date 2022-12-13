import { NodeSchema } from '../schema';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isNodeSchema(data: any): data is NodeSchema {
  return data && data.componentName;
}
