import { IPublicTypeNodeSchema } from '@alilc/lowcode-types';
import { isObject } from '../is-object';

export function isNodeSchema(data: any): data is IPublicTypeNodeSchema {
  if (!isObject(data)) {
    return false;
  }
  return 'componentName' in data && !data.isNode;
}
