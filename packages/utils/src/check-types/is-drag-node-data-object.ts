import { IPublicEnumDragObjectType, IPublicTypeDragNodeDataObject } from '@alilc/lowcode-types';

export function isDragNodeDataObject(obj: any): obj is IPublicTypeDragNodeDataObject {
  return obj && obj.type === IPublicEnumDragObjectType.NodeData;
}