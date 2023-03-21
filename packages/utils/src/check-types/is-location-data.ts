import { IPublicTypeLocationData } from '@alilc/lowcode-types';

export function isLocationData(obj: any): obj is IPublicTypeLocationData {
  return obj && obj.target && obj.detail;
}