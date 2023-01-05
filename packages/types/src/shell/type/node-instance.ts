import { IPublicTypeComponentInstance, IPublicModelNode } from '..';

export interface IPublicTypeNodeInstance<T = IPublicTypeComponentInstance> {
  docId: string;
  nodeId: string;
  instance: T;
  node?: IPublicModelNode | null;
}
