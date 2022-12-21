import { IPublicEnumDragObjectType } from '@alilc/lowcode-types';

export function isDragNodeDataObject(obj: any): boolean {
  return obj && obj.type === IPublicEnumDragObjectType.NodeData;
}