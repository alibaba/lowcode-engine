import { ComponentMap, ProCodeComponentType } from '@alilc/lowcode-types';


export function isProCodeComponentType(desc: ComponentMap): desc is ProCodeComponentType {
  return 'package' in desc;
}
