import { IPublicTypeComponentMap, IPublicTypeProCodeComponent } from '@alilc/lowcode-types';


export function isProCodeComponentType(desc: IPublicTypeComponentMap): desc is IPublicTypeProCodeComponent {
  return 'package' in desc;
}
