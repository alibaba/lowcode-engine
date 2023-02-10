import {
  IPublicModelNode,
  IPublicModelProp,
} from '../model';

export interface IPublicTypePropChangeOptions {
  key?: string | number;
  prop?: IPublicModelProp;
  node: IPublicModelNode;
  newValue: any;
  oldValue: any;
}
