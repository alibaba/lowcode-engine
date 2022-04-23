import { ResultFile, ResultDir } from '@alilc/lowcode-types';
import nm from 'nanomatch';

import { CodeGeneratorError } from '../types/error';
import { FlattenFile } from '../types/file';

export function createResultFile(name: string, ext = 'jsx', content = ''): ResultFile {
  return {
    name,
    ext,
    content,
  };
}

export function createResultDir(name: string): ResultDir {
  return {
    name,
    dirs: [],
    files: [],
  };
}

export function addDirectory(target: ResultDir, dir: ResultDir): void {
  if (target.dirs.findIndex((d) => d.name === dir.name) < 0) {
    target.dirs.push(dir);
  } else {
    throw new CodeGeneratorError(
      `Adding same directory to one directory: ${dir.name} -> ${target.name}`,
    );
  }
}

export function addFile(target: ResultDir, file: ResultFile): void {
  if (target.files.findIndex((f) => f.name === file.name && f.ext === file.ext) < 0) {
    target.files.push(file);
  } else {
    throw new CodeGeneratorError(
      `Adding same file to one directory: ${file.name} -> ${target.name}`,
    );
  }
}

export function flattenResult(dir: ResultDir, cwd = ''): FlattenFile[] {
  if (!dir.files.length && !dir.dirs.length) {
    return [];
  }

  return [
    ...dir.files.map(
      (file): FlattenFile => ({
        pathName: joinPath(cwd, `${file.name}${file.ext ? `.${file.ext}` : ''}`),
        content: file.content,
      }),
    ),
  ].concat(...dir.dirs.map((subDir) => flattenResult(subDir, joinPath(cwd, subDir.name))));
}

export type GlobOptions = {
  /** 是否查找 ".xxx" 文件, 默认: 否 */
  dot?: boolean;
};

/**
 * 查找文件
 * @param result 出码结果
 * @param fileGlobExpr 文件名匹配表达式
 * @param resultDirPath 出码结果的路径（默认是 '.'）
 * @returns 匹配的第一个文件或 null （找不到）
 */
export function findFile(
  result: ResultDir,
  fileGlobExpr: string,
  options: GlobOptions = {},
  resultDirPath = getResultNameOrDefault(result, ''),
): ResultFile | null {
  const maxDepth = !/\/|\*\*/.test(fileGlobExpr) ? 1 : undefined; // 如果 glob 表达式里面压根不会匹配子目录，则深度限制为 1
  const files = scanFiles(result, resultDirPath, maxDepth);

  for (let [filePath, file] of files) {
    if (nm.isMatch(filePath, fileGlobExpr, options)) {
      return file;
    }
  }

  return null;
}

/**
 * 使用 glob 语法查找多个文件
 * @param result 出码结果
 * @param fileGlobExpr 文件名匹配表达式
 * @param resultDirPath 出码结果的路径（默认是 '.'）
 * @returns 找到的文件列表的迭代器 [ [文件路径, 文件信息], ... ]
 */
export function* globFiles(
  result: ResultDir,
  fileGlobExpr: string,
  options: GlobOptions = {},
  resultDirPath = getResultNameOrDefault(result, ''),
): IterableIterator<[string, ResultFile]> {
  const files = scanFiles(result, resultDirPath);

  for (let [filePath, file] of files) {
    if (nm.isMatch(filePath, fileGlobExpr, options)) {
      yield [filePath, file];
    }
  }
}

/**
 * 遍历所有的文件
 */
export function* scanFiles(
  result: ResultDir,
  resultDirPath = getResultNameOrDefault(result, ''),
  maxDepth = 10000,
): IterableIterator<[string, ResultFile]> {
  for (let file of result.files) {
    const fileName = getFileNameWithExt(file);
    yield [joinPath(resultDirPath, fileName), file];
  }

  for (let subDir of result.dirs) {
    yield* scanFiles(subDir, joinPath(resultDirPath, subDir.name), maxDepth - 1);
  }
}

export function getFileNameWithExt(file: ResultFile) {
  return `${file.name}${file.ext ? `.${file.ext}` : ''}`;
}

function getResultNameOrDefault(result: ResultDir, defaultDir = '/') {
  return result.name && result.name !== '.' ? result.name : defaultDir;
}

function joinPath(...pathParts: string[]): string {
  return pathParts
    .filter((x) => x !== '' && x !== '.')
    .join('/')
    .replace(/\\+/g, '/')
    .replace(/\/+/g, '/');
}

export function* scanDirs(
  result: ResultDir,
  resultDirPath = getResultNameOrDefault(result, ''),
  maxDepth = 10000,
): IterableIterator<[string, ResultDir]> {
  yield [resultDirPath, result];

  for (let subDir of result.dirs) {
    yield* scanDirs(subDir, joinPath(resultDirPath, subDir.name), maxDepth - 1);
  }
}

export function* globDirs(
  result: ResultDir,
  dirGlobExpr: string,
  options: GlobOptions = {},
  resultDirPath = getResultNameOrDefault(result, ''),
): IterableIterator<[string, ResultDir]> {
  const dirs = scanDirs(result, resultDirPath);

  for (let [dirPath, dir] of dirs) {
    if (nm.isMatch(dirPath, dirGlobExpr, options)) {
      yield [dirPath, dir];
    }
  }
}

export function findDir(
  result: ResultDir,
  dirGlobExpr: string,
  options: GlobOptions = {},
  resultDirPath = getResultNameOrDefault(result, ''),
): ResultDir | null {
  const dirs = scanDirs(result, resultDirPath);

  for (let [dirPath, dir] of dirs) {
    if (nm.isMatch(dirPath, dirGlobExpr, options)) {
      return dir;
    }
  }

  return null;
}

/**
 * 从结果中移除一些文件
 * @param result 出码结果目录
 * @param filePathGlobExpr 要移除的文件路径（glob 表达式）
 * @param globOptions glob 参数
 * @returns 移除了多少文件
 */
export function removeFilesFromResult(
  result: ResultDir,
  filePathGlobExpr: string,
  globOptions: GlobOptions = {},
): number {
  let removedCount = 0;
  const [dirPath, fileName] = splitPath(filePathGlobExpr);

  const dirs = dirPath ? globDirs(result, dirPath) : [['', result] as const];
  for (let [, dir] of dirs) {
    const files = globFiles(dir, fileName, globOptions, '.');
    for (let [, file] of files) {
      dir.files.splice(dir.files.indexOf(file), 1);
      removedCount += 1;
    }
  }

  return removedCount;
}

/**
 * 从结果中移除一些目录
 * @param result 出码结果目录
 * @param dirPathGlobExpr 要移除的目录路径（glob 表达式）
 * @param globOptions glob 参数
 * @returns 移除了多少文件
 */
export function removeDirsFromResult(
  result: ResultDir,
  dirPathGlobExpr: string,
  globOptions: GlobOptions = {},
): number {
  let removedCount = 0;
  const [dirPath, fileName] = splitPath(dirPathGlobExpr);

  const dirs = dirPath ? globDirs(result, dirPath) : [['', result] as const];
  for (let [, dir] of dirs) {
    const foundDirs = globDirs(dir, fileName, globOptions, '.');
    for (let [, foundDir] of foundDirs) {
      dir.dirs.splice(dir.dirs.indexOf(foundDir), 1);
      removedCount += 1;
    }
  }

  return removedCount;
}

/**
 * 将文件路径拆分为目录路径和文件名
 * @param filePath
 * @returns [fileDirPath, fileName]
 */
function splitPath(filePath: string) {
  const parts = filePath.split('/');
  const fileName = parts.pop() || '';
  return [joinPath(...parts), fileName];
}
