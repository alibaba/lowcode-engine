import { ResultDir } from '@alilc/lowcode-types';

export type PublisherFactory<T, U> = (configuration?: Partial<T>) => U;

export interface IPublisher<T, U> {
  publish: (options?: T) => Promise<IPublisherResponse<U>>;
  getProject: (() => ResultDir) | (() => void);
  setProject: (project: ResultDir) => void;
}

export interface IPublisherFactoryParams {
  project?: ResultDir;
}
export interface IPublisherResponse<T> {
  success: boolean;
  payload?: T;
}
