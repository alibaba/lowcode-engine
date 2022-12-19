import { TransformStage } from './transform-stage';
import { CompositeObject } from './value-type';

export type PropsReducerContext = {
  stage: TransformStage;
};

export type PropsTransducer = (
  props: CompositeObject,
  node: Node,
  ctx?: PropsReducerContext,
) => CompositeObject;
