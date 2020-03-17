import { IResultDir, IResultFile } from '@/types';

import CodeGenerator from '@/index';
import demoSchema from './simpleDemo';

function flatFiles(rootName: string | null, dir: IResultDir): IResultFile[] {
  const dirRoot: string = rootName ? `${rootName}/${dir.name}` : dir.name;
  const files: IResultFile[] = dir.files.map(file => ({
    name: `${dirRoot}/${file.name}.${file.ext}`,
    content: file.content,
    ext: '',
  }));
  const filesInSub = dir.dirs.map(subDir => flatFiles(`${dirRoot}`, subDir));
  const result: IResultFile[] = files.concat.apply(files, filesInSub);

  return result;
}

function main() {
  const createIceJsProjectBuilder = CodeGenerator.solutions.icejs;
  const builder = createIceJsProjectBuilder();
  builder.generateProject(demoSchema).then(result => {
    const files = flatFiles('.', result);
    files.forEach(file => {
      console.log(`========== ${file.name} Start ==========`);
      console.log(file.content);
      console.log(`========== ${file.name} End   ==========`);
    });
  });
}

main();
