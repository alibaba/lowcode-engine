import { ResultDir, ResultFile } from '@ali/lowcode-types';
import { createResultDir, addDirectory, addFile } from '../utils/resultHelper';

type FuncFileGenerator = () => [string[], ResultFile];

export function insertFile(root: ResultDir, path: string[], file: ResultFile) {
  let current: ResultDir = root;
  path.forEach((pathNode) => {
    const dir = current.dirs.find((d) => d.name === pathNode);
    if (dir) {
      current = dir;
    } else {
      const newDir = createResultDir(pathNode);
      addDirectory(current, newDir);
      current = newDir;
    }
  });

  addFile(current, file);
}

export function runFileGenerator(root: ResultDir, fun: FuncFileGenerator) {
  const [path, file] = fun();
  insertFile(root, path, file);
}
