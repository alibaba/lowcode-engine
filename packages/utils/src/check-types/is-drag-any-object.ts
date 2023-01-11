import { IPublicEnumDragObjectType } from '@alilc/lowcode-types';

export function isDragAnyObject(obj: any): boolean {
  return obj && obj.type !== IPublicEnumDragObjectType.NodeData && obj.type !== IPublicEnumDragObjectType.Node;
}