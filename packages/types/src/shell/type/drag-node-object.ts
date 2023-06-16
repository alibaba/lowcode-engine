import { IPublicModelNode } from '..';
import { IPublicEnumDragObjectType } from '../enum';

export interface IPublicTypeDragNodeObject<Node = IPublicModelNode> {
  type: IPublicEnumDragObjectType.Node;
  nodes: Node[];
}
