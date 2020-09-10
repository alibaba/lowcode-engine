import { IResultDir } from '@ali/lowcode-code-generator';
import { isNodeProcess, writeZipToDisk, generateProjectZip } from './utils'

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

declare type ZipPublisherResponse = string | Buffer | Blob

export interface ZipFactoryParams extends IPublisherFactoryParams {
  outputPath?: string
  projectSlug?: string
}

export interface ZipPublisher extends IPublisher<ZipFactoryParams, ZipPublisherResponse> {
  getOutputPath: () => string
  setOutputPath: (path: string) => void
}

export const createZipPublisher: PublisherFactory<ZipFactoryParams, ZipPublisher> = (
  params: ZipFactoryParams = {}
): ZipPublisher => {
  let { project, outputPath } = params

  const getProject = () => project
  const setProject = (projectToSet: IResultDir) => {
    project = projectToSet
  }

  const getOutputPath = () => outputPath
  const setOutputPath = (path: string) => {
    outputPath = path
  }

  const publish = async (options: ZipFactoryParams = {}) => {
    const projectToPublish = options.project || project
    if (!projectToPublish) {
      throw new Error('MissingProject');
    }

    const zipName = options.projectSlug || params.projectSlug || projectToPublish.name

    try {
      const zipContent = await generateProjectZip(projectToPublish)

      // If not output path is provided, zip is not written to disk
      const projectOutputPath = options.outputPath || outputPath
      if (projectOutputPath && isNodeProcess()) {
        await writeZipToDisk(projectOutputPath, zipContent, zipName)
      }
      return { success: true, payload: zipContent }
    } catch (error) {
      throw new Error('ZipUnexpected');
    }
  }

  return {
    publish,
    getProject,
    setProject,
    getOutputPath,
    setOutputPath,
  }
}
