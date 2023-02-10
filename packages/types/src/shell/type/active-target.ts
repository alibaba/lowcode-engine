import { IPublicModelNode } from '../model';
import { IPublicTypeLocationDetail, IPublicTypeComponentInstance } from './';

export interface IPublicTypeActiveTarget {
  node: IPublicModelNode;
  detail?: IPublicTypeLocationDetail;
  instance?: IPublicTypeComponentInstance;
}
