import { IPublicEnumDragObjectType, IPublicModelNode, IPublicTypeDragNodeObject } from '@alilc/lowcode-types';

export function isDragNodeObject<Node = IPublicModelNode>(obj: any): obj is IPublicTypeDragNodeObject<Node> {
  return obj && obj.type === IPublicEnumDragObjectType.Node;
}