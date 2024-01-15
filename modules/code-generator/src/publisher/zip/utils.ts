import JSZip from 'jszip';
import { ResultDir, ResultFile } from '@alilc/lowcode-types';
import type { ZipBuffer } from './index';

export const isNodeProcess = (): boolean => {
  return (
    typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined'
  );
};

export const writeZipToDisk = (
  zipFolderPath: string,
  content: ZipBuffer,
  zipName: string,
): void => {
  if (!isNodeProcess()) {
    throw new Error('ZipPublisher: writeZipToDisk is only available in NodeJS');
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path');

  if (!fs.existsSync(zipFolderPath)) {
    fs.mkdirSync(zipFolderPath, { recursive: true });
  }

  const zipPath = path.join(zipFolderPath, `${zipName}.zip`);

  const writeStream = fs.createWriteStream(zipPath);
  writeStream.write(content);
  writeStream.end();
};

export const generateProjectZip = async (project: ResultDir): Promise<ZipBuffer> => {
  let zip = new JSZip();
  zip = writeFolderToZip(project, zip, true);
  const zipType = isNodeProcess() ? 'nodebuffer' : 'blob';
  return zip.generateAsync({ type: zipType });
};

const writeFolderToZip = (folder: ResultDir, parentFolder: JSZip, ignoreFolder = false) => {
  const zipFolder = ignoreFolder ? parentFolder : parentFolder.folder(folder.name);
  if (zipFolder !== null) {
    folder.files.forEach((file: ResultFile) => {
      // const options = file.contentEncoding === 'base64' ? { base64: true } : {};
      const options = {};
      const fileName = file.ext ? `${file.name}.${file.ext}` : file.name;
      zipFolder.file(fileName, file.content, options);
    });

    folder.dirs.forEach((subFolder: ResultDir) => {
      writeFolderToZip(subFolder, zipFolder);
    });
  }

  return parentFolder;
};
