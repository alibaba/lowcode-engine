import { IPublicTypeLocationChildrenDetail, IPublicTypeLocationDetailType } from '@alilc/lowcode-types';

export function isLocationChildrenDetail(obj: any): obj is IPublicTypeLocationChildrenDetail {
  return obj && obj.type === IPublicTypeLocationDetailType.Children;
}