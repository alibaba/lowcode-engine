import { IResultFile, IResultDir } from '../types';
import ResultDir from '../model/ResultDir';

type FuncFileGenerator = () => [string[], IResultFile];

export function insertFile(root: IResultDir, path: string[], file: IResultFile) {
  let current: IResultDir = root;
  path.forEach(pathNode => {
    const dir = current.dirs.find(d => d.name === pathNode);
    if (dir) {
      current = dir;
    } else {
      const newDir = new ResultDir(pathNode);
      current.addDirectory(newDir);
      current = newDir;
    }
  });

  current.addFile(file);
}

export function runFileGenerator(root: IResultDir, fun: FuncFileGenerator) {
  const [path, file] = fun();
  insertFile(root, path, file);
}
