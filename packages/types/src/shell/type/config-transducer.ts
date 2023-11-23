import { IPublicTypeSkeletonConfig } from '.';

export interface IPublicTypeConfigTransducer {
  (prev: IPublicTypeSkeletonConfig): IPublicTypeSkeletonConfig;

  level?: number;

  id?: string;
}
