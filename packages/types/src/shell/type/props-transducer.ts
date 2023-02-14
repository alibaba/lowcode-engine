import { IPublicEnumTransformStage } from '../enum';
import { IPublicModelNode } from '../model';
import { IPublicTypeCompositeObject } from './';

export type IPublicTypePropsTransducer = (
  props: IPublicTypeCompositeObject,
  node: IPublicModelNode,
  ctx?: {
    stage: IPublicEnumTransformStage;
  },
) => IPublicTypeCompositeObject;
