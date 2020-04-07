import { existsSync, mkdir, writeFile } from 'fs';
import { join } from 'path';

import { IResultDir, IResultFile } from '../../types';

export const writeFolder = async (
  folder: IResultDir,
  currentPath: string,
  createProjectFolder = true,
): Promise<void> => {
  const { name, files, dirs } = folder;

  const folderPath = createProjectFolder
    ? join(currentPath, name)
    : currentPath;

  if (!existsSync(folderPath)) {
    await createDirectory(folderPath);
  }

  const promises = [
    writeFilesToFolder(folderPath, files),
    writeSubFoldersToFolder(folderPath, dirs),
  ];

  await Promise.all(promises);
};

const writeFilesToFolder = async (
  folderPath: string,
  files: IResultFile[],
): Promise<void> => {
  const promises = files.map(file => {
    const fileName = file.ext ? `${file.name}.${file.ext}` : file.name;
    const filePath = join(folderPath, fileName);
    return writeContentToFile(filePath, file.content);
  });

  await Promise.all(promises);
};

const writeSubFoldersToFolder = async (
  folderPath: string,
  subFolders: IResultDir[],
): Promise<void> => {
  const promises = subFolders.map(subFolder => {
    return writeFolder(subFolder, folderPath);
  });

  await Promise.all(promises);
};

const createDirectory = (pathToDir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    mkdir(pathToDir, { recursive: true }, err => {
      err ? reject(err) : resolve();
    });
  });
};

const writeContentToFile = (
  filePath: string,
  fileContent: string,
  encoding: string = 'utf8',
): Promise<void> => {
  return new Promise((resolve, reject) => {
    writeFile(filePath, fileContent, encoding, err => {
      err ? reject(err) : resolve();
    });
  });
};
