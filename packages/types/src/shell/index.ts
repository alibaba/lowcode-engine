import {
  IPublicModelNode,
  IPublicModelProp,
} from './model';

export interface PropChangeOptions {
  key?: string | number;
  prop?: IPublicModelProp;
  node: IPublicModelNode;
  newValue: any;
  oldValue: any;
}

export * from './api';
export * from './model';