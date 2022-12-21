import { isProCodeComponentType } from './is-procode-component-type';
import { IPublicTypeComponentMap } from '@alilc/lowcode-types';


export function isLowCodeComponentType(desc: IPublicTypeComponentMap): boolean {
  return !isProCodeComponentType(desc);
}
