import { IPublicTypeComponentMap } from '@alilc/lowcode-types';


export function isProCodeComponentType(desc: IPublicTypeComponentMap): boolean {
  return 'package' in desc;
}
