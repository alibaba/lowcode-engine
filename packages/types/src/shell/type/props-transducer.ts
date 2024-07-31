import { IPublicEnumTransformStage } from '../enum';
import { IPublicModelNode } from '../model';
import { IPublicTypePropsMap } from './';

export type IPublicTypePropsTransducer = (
  props: IPublicTypePropsMap,
  node: IPublicModelNode,
  ctx?: {
    stage: IPublicEnumTransformStage;
  },
) => IPublicTypePropsMap;
