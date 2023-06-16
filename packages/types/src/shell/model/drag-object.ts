import { IPublicEnumDragObjectType } from '../enum';
import { IPublicTypeNodeSchema } from '../type';
import { IPublicModelNode } from './node';

export class IPublicModelDragObject {
  type: IPublicEnumDragObjectType.Node | IPublicEnumDragObjectType.NodeData;

  data: IPublicTypeNodeSchema | IPublicTypeNodeSchema[] | null;

  nodes: (IPublicModelNode | null)[] | null;
}
