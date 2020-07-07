const fs = require('fs');
const CodeGenerator = require('../lib').default;

function flatFiles(rootName, dir) {
  const dirRoot = rootName ? `${rootName}/${dir.name}` : dir.name;
  const files = dir.files.map(file => ({
    name: `${dirRoot}/${file.name}.${file.ext}`,
    content: file.content,
    ext: '',
  }));
  const filesInSub = dir.dirs.map(subDir => flatFiles(`${dirRoot}`, subDir));
  const result = files.concat.apply(files, filesInSub);

  return result;
}

function displayResultInConsole(root, fileName) {
  const files = flatFiles('.', root);
  files.forEach(file => {
    if (!fileName || fileName === file.name) {
      console.log(`========== ${file.name} Start ==========`);
      console.log(file.content);
      console.log(`========== ${file.name} End   ==========`);
    }
  });
}

async function writeResultToDisk(root, path) {
  const publisher = CodeGenerator.publishers.disk();

  return publisher.publish({
    project: root,
    outputPath: path,
    projectSlug: 'demo-project',
    createProjectFolder: true,
  });
}

function main() {
  const schemaJson = fs.readFileSync('./demo/sampleSchema.json', { encoding: 'utf8' });
  const createIceJsProjectBuilder = CodeGenerator.solutions.icejs;
  const builder = createIceJsProjectBuilder();

  builder.generateProject(schemaJson).then(result => {
    displayResultInConsole(result);
    writeResultToDisk(result, 'output/lowcodeDemo').then(response =>
      console.log('Write to disk: ', JSON.stringify(response)),
    );
    return result;
  });
}

main();
