import { NodeSchema } from '@alilc/lowcode-types';

export function isNodeSchema(data: any): data is NodeSchema {
  return data && data.componentName;
}
