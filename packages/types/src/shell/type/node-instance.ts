import { IPublicTypeComponentInstance, IPublicModelNode } from '..';

export interface IPublicTypeNodeInstance<
  T = IPublicTypeComponentInstance,
  Node = IPublicModelNode
> {
  docId: string;
  nodeId: string;
  instance: T;
  node?: Node | null;
}
