import { IPublicTypeActiveTarget } from '../type';

export interface IPublicModelActiveTracker {
  onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void;
}
