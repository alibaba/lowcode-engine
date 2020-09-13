import {
  IResultDir,
} from './index';

export type PublisherFactory<T, U> = (configuration?: Partial<T>) => U;

export interface IPublisher<T, U> {
  publish: (options?: T) => Promise<IPublisherResponse<U>>;
  getProject: () => IResultDir | void;
  setProject: (project: IResultDir) => void;
}

export interface IPublisherFactoryParams {
  project?: IResultDir;
}
export interface IPublisherResponse<T> {
  success: boolean;
  payload?: T;
}
