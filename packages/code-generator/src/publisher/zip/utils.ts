import JSZip from 'jszip';
import { ResultDir, ResultFile } from '@ali/lowcode-types';
import { ZipBuffer } from './index';

export const isNodeProcess = (): boolean => {
  return (
    typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node !== 'undefined'
  );
};

export const writeZipToDisk = (zipFolderPath: string, content: ZipBuffer, zipName: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
  // const zipType = isNodeProcess() ? 'nodebuffer' : 'blob';
  const zipType = 'nodebuffer'; // 目前先只支持 node 调用
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
