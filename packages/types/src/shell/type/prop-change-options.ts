import {
  IPublicModelNode,
  IPublicModelProp,
} from '../model';

export interface IPublicTypePropChangeOptions<
  Node = IPublicModelNode
> {
  key?: string | number;
  prop?: IPublicModelProp;
  node: Node;
  newValue: any;
  oldValue: any;
}
