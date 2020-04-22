import { IResultDir, IResultFile } from '../types';

import codeGenerator from '../index';
import { createDiskPublisher } from '../publisher/disk';
// import demoSchema from './simpleDemo';
import demoSchema from './recoreDemo';

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

function displayResultInConsole(root: IResultDir, fileName?: string): void {
  const files = flatFiles('.', root);
  files.forEach(file => {
    if (!fileName || fileName === file.name) {
      console.log(`========== ${file.name} Start ==========`);
      console.log(file.content);
      console.log(`========== ${file.name} End   ==========`);
    }
  });
}

async function writeResultToDisk(root: IResultDir, path: string): Promise<any> {
  const publisher = createDiskPublisher();

  return publisher.publish({
    project: root,
    outputPath: path,
    projectSlug: 'demo-project',
    createProjectFolder: true,
  });
}

function main() {
  // const createIceJsProjectBuilder = codeGenerator.solutions.icejs;
  // const builder = createIceJsProjectBuilder();

  const createRecoreProjectBuilder = codeGenerator.solutions.recore;
  const builder = createRecoreProjectBuilder();

  builder.generateProject(demoSchema).then(result => {
    displayResultInConsole(result);
    // writeResultToDisk(result, '/Users/armslave/lowcodeDemo').then(response =>
    //   console.log('Write to disk: ', JSON.stringify(response)),
    // );
    return result;
  });
}

main();
