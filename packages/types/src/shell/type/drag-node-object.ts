import { IPublicModelNode } from '..';
import { IPublicEnumDragObjectType } from '../enum';

export interface IPublicTypeDragNodeObject {
  type: IPublicEnumDragObjectType.Node;
  nodes: IPublicModelNode[];
}
