import { ResultDir } from '@alilc/lowcode-types';
import { PublisherFactory, IPublisher, IPublisherFactoryParams, PublisherError } from '../../types';
import { getErrorMessage } from '../../utils/errors';
import { isNodeProcess, writeZipToDisk, generateProjectZip } from './utils';
import { saveAs } from 'file-saver';

export type ZipBuffer = Buffer | Blob;

declare type ZipPublisherResponse = string | ZipBuffer;

export interface ZipFactoryParams extends IPublisherFactoryParams {
  outputPath?: string;
  projectSlug?: string;
}

export interface ZipPublisher extends IPublisher<ZipFactoryParams, ZipPublisherResponse> {
  getOutputPath: () => string | undefined;
  setOutputPath: (path: string) => void;
}

export const createZipPublisher: PublisherFactory<ZipFactoryParams, ZipPublisher> = (
  params: ZipFactoryParams = {},
): ZipPublisher => {
  let { project, outputPath } = params;

  const getProject = () => project;
  const setProject = (projectToSet: ResultDir) => {
    project = projectToSet;
  };

  const getOutputPath = () => outputPath;
  const setOutputPath = (path: string) => {
    outputPath = path;
  };

  const publish = async (options: ZipFactoryParams = {}) => {
    const projectToPublish = options.project || project;
    if (!projectToPublish) {
      throw new PublisherError('MissingProject');
    }

    const zipName = options.projectSlug || params.projectSlug || projectToPublish.name;

    try {
      const zipContent = await generateProjectZip(projectToPublish);

      if (isNodeProcess()) {
        // If not output path is provided on the node side, zip is not written to disk
        const projectOutputPath = options.outputPath || outputPath;
        if (projectOutputPath) {
          await writeZipToDisk(projectOutputPath, zipContent, zipName);
        }
      } else {
        // the browser end does not require a path
        // auto download zip files
        saveAs(zipContent as Blob, `${zipName}.zip`);
      }

      return { success: true, payload: zipContent };
    } catch (error) {
      throw new PublisherError(getErrorMessage(error) || 'UnknownError');
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
