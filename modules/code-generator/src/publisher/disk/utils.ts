import * as systemFs from 'fs';
import { join } from 'path';
import { ResultDir, ResultFile } from '@alilc/lowcode-types';

export interface IFileSystem {
  existsSync: typeof systemFs.existsSync;
  mkdir: typeof systemFs.mkdir;
  writeFile: typeof systemFs.writeFile;
}

export const writeFolder = async (
  folder: ResultDir,
  currentPath: string,
  createProjectFolder = true,
  fs: IFileSystem = systemFs,
): Promise<void> => {
  const { name, files, dirs } = folder;

  const folderPath = createProjectFolder ? join(currentPath, name) : currentPath;

  if (!fs.existsSync(folderPath)) {
    await createDirectory(folderPath, fs);
  }

  const promises = [
    writeFilesToFolder(folderPath, files, fs),
    writeSubFoldersToFolder(folderPath, dirs, fs),
  ];

  await Promise.all(promises);
};

const writeFilesToFolder = async (
  folderPath: string,
  files: ResultFile[],
  fs: IFileSystem,
): Promise<void> => {
  const promises = files.map((file) => {
    const fileName = file.ext ? `${file.name}.${file.ext}` : file.name;
    const filePath = join(folderPath, fileName);
    return writeContentToFile(filePath, file.content, 'utf8', fs);
  });

  await Promise.all(promises);
};

const writeSubFoldersToFolder = async (
  folderPath: string,
  subFolders: ResultDir[],
  fs: IFileSystem,
): Promise<void> => {
  const promises = subFolders.map((subFolder) => {
    return writeFolder(subFolder, folderPath, true, fs);
  });

  await Promise.all(promises);
};

const createDirectory = (pathToDir: string, fs: IFileSystem): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(pathToDir, { recursive: true }, (err) => {
      err ? reject(err) : resolve();
    });
  });
};

const writeContentToFile = (
  filePath: string,
  fileContent: string,
  encoding = 'utf8',
  fs: IFileSystem,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContent, { encoding: encoding as BufferEncoding }, (err) => {
      err ? reject(err) : resolve();
    });
  });
};
