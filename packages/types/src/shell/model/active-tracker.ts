import { IPublicTypeActiveTarget } from '../type';
import { IPublicModelNode } from './node';

export interface IPublicModelActiveTracker {
  onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void;

  track(node: IPublicModelNode): void;
}
