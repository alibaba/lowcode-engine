import { CodeGeneratorError, IResultDir } from '../../types';

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

import { writeFolder } from './utils';

export interface IDiskFactoryParams extends IPublisherFactoryParams {
  outputPath?: string;
  projectSlug?: string;
  createProjectFolder?: boolean;
}

export interface IDiskPublisher extends IPublisher<IDiskFactoryParams, string> {
  getOutputPath: () => string;
  setOutputPath: (path: string) => void;
}

export const createDiskPublisher: PublisherFactory<
  IDiskFactoryParams,
  IDiskPublisher
> = (params: IDiskFactoryParams = {}): IDiskPublisher => {
  let { project, outputPath = './' } = params;

  const getProject = (): IResultDir => {
    if (!project) {
      throw new CodeGeneratorError('Missing Project');
    }
    return project;
  };
  const setProject = (projectToSet: IResultDir): void => {
    project = projectToSet;
  };

  const getOutputPath = (): string => {
    return outputPath;
  };
  const setOutputPath = (path: string): void => {
    outputPath = path;
  };

  const publish = async (options: IDiskFactoryParams = {}) => {
    const projectToPublish = options.project || project;
    if (!projectToPublish) {
      throw new CodeGeneratorError('Missing Project');
    }

    const projectOutputPath = options.outputPath || outputPath;
    const overrideProjectSlug = options.projectSlug || params.projectSlug;
    const createProjectFolder =
      options.createProjectFolder || params.createProjectFolder;

    if (overrideProjectSlug) {
      projectToPublish.name = overrideProjectSlug;
    }

    try {
      await writeFolder(
        projectToPublish,
        projectOutputPath,
        createProjectFolder,
      );
      return { success: true, payload: projectOutputPath };
    } catch (error) {
      throw new CodeGeneratorError(error);
    }
  };

  return {
    publish,
    getProject,
    setProject,
    getOutputPath,
    setOutputPath,
  };
};
