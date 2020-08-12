import { ResultDir } from '@ali/lowcode-types';
import { PublisherFactory, IPublisher, IPublisherFactoryParams, PublisherError } from '../../types';
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

export const createDiskPublisher: PublisherFactory<IDiskFactoryParams, IDiskPublisher> = (
  params: IDiskFactoryParams = {},
): IDiskPublisher => {
  let { project, outputPath = './' } = params;

  const getProject = (): ResultDir => {
    if (!project) {
      throw new PublisherError('Missing Project');
    }
    return project;
  };
  const setProject = (projectToSet: ResultDir): void => {
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
      throw new PublisherError('Missing Project');
    }

    const projectOutputPath = options.outputPath || outputPath;
    const overrideProjectSlug = options.projectSlug || params.projectSlug;
    const createProjectFolder = options.createProjectFolder || params.createProjectFolder;

    if (overrideProjectSlug) {
      projectToPublish.name = overrideProjectSlug;
    }

    try {
      await writeFolder(projectToPublish, projectOutputPath, createProjectFolder);
      return { success: true, payload: projectOutputPath };
    } catch (error) {
      throw new PublisherError(error);
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
