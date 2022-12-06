import { isProCodeComponentType } from './is-procode-component-type';
import { ComponentMap, LowCodeComponentType } from '@alilc/lowcode-types';


export function isLowCodeComponentType(desc: ComponentMap): desc is LowCodeComponentType {
  return !isProCodeComponentType(desc);
}
