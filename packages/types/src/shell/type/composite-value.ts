import { IPublicTypeJSONValue, IPublicTypeJSExpression, IPublicTypeJSFunction, IPublicTypeJSSlot, IPublicTypeCompositeArray, IPublicTypeCompositeObject } from './';

/**
 * 复合类型
 */
export type IPublicTypeCompositeValue = IPublicTypeJSONValue |
  IPublicTypeJSExpression |
  IPublicTypeJSFunction |
  IPublicTypeJSSlot |
  IPublicTypeCompositeArray |
  IPublicTypeCompositeObject;
