import { IPublicModelNode } from '..';

export interface IPublicTypeOnChangeOptions<
  Node = IPublicModelNode
> {
  type: string;
  node: Node;
}
