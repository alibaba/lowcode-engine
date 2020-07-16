import JSZip from 'jszip';
import { IResultDir, IResultFile } from '../../types';
import { ZipBuffer } from './index';

export const isNodeProcess = (): boolean => {
  return (
    typeof process === 'object' &&
    typeof process.versions === 'object' &&
    typeof process.versions.node !== 'undefined'
  );
}

export const writeZipToDisk = (
  zipFolderPath: string,
  content: ZipBuffer,
  zipName: string,
): void => {
  const fs = require('fs');
  const path = require('path');

  if (!fs.existsSync(zipFolderPath)) {
    fs.mkdirSync(zipFolderPath, { recursive: true });
  }

  const zipPath = path.join(zipFolderPath, `${zipName}.zip`);

  const writeStream = fs.createWriteStream(zipPath);
  writeStream.write(content);
  writeStream.end();
}

export const generateProjectZip = async (project: IResultDir): Promise<ZipBuffer> => {
  let zip = new JSZip();
  zip = writeFolderToZip(project, zip, true);
  // const zipType = isNodeProcess() ? 'nodebuffer' : 'blob';
  const zipType = 'nodebuffer'; // 目前先只支持 node 调用
  return zip.generateAsync({ type: zipType });
}

const writeFolderToZip = (
  folder: IResultDir,
  parentFolder: JSZip,
  ignoreFolder: boolean = false,
) => {
  const zipFolder = ignoreFolder ? parentFolder : parentFolder.folder(folder.name);
  if (zipFolder !== null) {
    folder.files.forEach((file: IResultFile) => {
      // const options = file.contentEncoding === 'base64' ? { base64: true } : {};
      const options = {};
      const fileName = file.ext ? `${file.name}.${file.ext}` : file.name;
      zipFolder.file(fileName, file.content, options);
    });

    folder.dirs.forEach((subFolder: IResultDir) => {
      writeFolderToZip(subFolder, zipFolder);
    });
  }

  return parentFolder;
}
