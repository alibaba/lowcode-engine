import { IPublicModelNode } from './shell';

export enum PROP_VALUE_CHANGED_TYPE {
  /**
   * normal set value
   */
  SET_VALUE = 'SET_VALUE',
  /**
   * value changed caused by sub-prop value change
   */
  SUB_VALUE_CHANGE = 'SUB_VALUE_CHANGE',
}

export interface ISetValueOptions {
  disableMutator?: boolean;
  type?: PROP_VALUE_CHANGED_TYPE;
  fromSetHotValue?: boolean;
}

export interface IPublicOnChangeOptions {
  type: string;
  node: IPublicModelNode;
}
