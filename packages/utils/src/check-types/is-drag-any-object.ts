import { IPublicEnumDragObjectType } from '@alilc/lowcode-types';
import { isObject } from '../is-object';

export function isDragAnyObject(obj: any): boolean {
  if (!isObject(obj)) {
    return false;
  }
  return obj.type !== IPublicEnumDragObjectType.NodeData && obj.type !== IPublicEnumDragObjectType.Node;
}
