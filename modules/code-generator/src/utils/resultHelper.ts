import { ResultFile, ResultDir } from '@alilc/lowcode-types';

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
        pathName: `${cwd ? `${cwd}/` : ''}${file.name}${file.ext ? `.${file.ext}` : ''}`,
        content: file.content,
      }),
    ),
  ].concat(
    ...dir.dirs.map((subDir) =>
      flattenResult(subDir, [cwd, subDir.name].filter((x) => x !== '' && x !== '.').join('/')),
    ),
  );
}
