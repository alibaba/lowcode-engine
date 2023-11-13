/* eslint-disable max-len */
import { IPublicTypePropConfig } from './';

export type IPublicTypePropType = IPublicTypeBasicType | IPublicTypeRequiredType | IPublicTypeComplexType;
export type IPublicTypeBasicType = 'array' | 'bool' | 'func' | 'number' | 'object' | 'string' | 'node' | 'element' | 'any';
export type IPublicTypeComplexType = IPublicTypeOneOf | IPublicTypeOneOfType | IPublicTypeArrayOf | IPublicTypeObjectOf | IPublicTypeShape | IPublicTypeExact | IPublicTypeInstanceOf;

export interface IPublicTypeRequiredType {
  type: IPublicTypeBasicType;
  isRequired?: boolean;
}

export interface IPublicTypeOneOf {
  type: 'oneOf';
  value: string[];
  isRequired?: boolean;
}
export interface IPublicTypeOneOfType {
  type: 'oneOfType';
  value: IPublicTypePropType[];
  isRequired?: boolean;
}
export interface IPublicTypeArrayOf {
  type: 'arrayOf';
  value: IPublicTypePropType;
  isRequired?: boolean;
}
export interface IPublicTypeObjectOf {
  type: 'objectOf';
  value: IPublicTypePropType;
  isRequired?: boolean;
}
export interface IPublicTypeShape {
  type: 'shape';
  value: IPublicTypePropConfig[];
  isRequired?: boolean;
}
export interface IPublicTypeExact {
  type: 'exact';
  value: IPublicTypePropConfig[];
  isRequired?: boolean;
}

export interface IPublicTypeInstanceOf {
  type: 'instanceOf';
  value: IPublicTypePropConfig;
  isRequired?: boolean;
}
