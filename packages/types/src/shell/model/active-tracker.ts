import { IPublicTypeActiveTarget } from '../type';
import { IPublicModelNode } from './node';

export interface IPublicModelActiveTracker {

  /**
   * @since 1.1.7
   */
  target: IPublicTypeActiveTarget;

  onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void;

  track(node: IPublicModelNode): void;
}
