import { IPublicTypeLocationDetailType } from '@alilc/lowcode-types';

export function isLocationChildrenDetail(obj: any): boolean {
  return obj && obj.type === IPublicTypeLocationDetailType.Children;
}