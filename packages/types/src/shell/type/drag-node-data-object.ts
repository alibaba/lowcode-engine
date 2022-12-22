import { IPublicTypeNodeSchema } from './';
import { IPublicEnumDragObjectType } from '../enum';

export interface IPublicTypeDragNodeDataObject {
  type: IPublicEnumDragObjectType.NodeData;
  data: IPublicTypeNodeSchema | IPublicTypeNodeSchema[];
  thumbnail?: string;
  description?: string;
  [extra: string]: any;
}
