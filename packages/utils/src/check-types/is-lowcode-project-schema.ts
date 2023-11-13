import { IPublicTypeComponentSchema, IPublicTypeProjectSchema } from '@alilc/lowcode-types';
import { isComponentSchema } from './is-component-schema';
import { isObject } from '../is-object';

export function isLowcodeProjectSchema(data: any): data is IPublicTypeProjectSchema<IPublicTypeComponentSchema> {
  if (!isObject(data)) {
    return false;
  }

  if (!('componentsTree' in data) || data.componentsTree.length === 0) {
    return false;
  }

  return isComponentSchema(data.componentsTree[0]);
}
