import { IPublicEnumDragObjectType, IPublicTypeDragNodeDataObject } from '@alilc/lowcode-types';
import { isObject } from '../is-object';

export function isDragNodeDataObject(obj: any): obj is IPublicTypeDragNodeDataObject {
  if (!isObject(obj)) {
    return false;
  }
  return obj.type === IPublicEnumDragObjectType.NodeData;
}
