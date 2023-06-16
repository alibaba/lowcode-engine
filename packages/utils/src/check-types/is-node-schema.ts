import { IPublicTypeNodeSchema } from '@alilc/lowcode-types';

export function isNodeSchema(data: any): data is IPublicTypeNodeSchema {
  return data && data.componentName && !data.isNode;
}
