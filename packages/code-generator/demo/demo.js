const fs = require('fs');
// ../lib 可以替换成 @ali/lowcode-code-generator
const CodeGenerator = require('../lib').default;

function flatFiles(rootName, dir) {
  const dirRoot = rootName ? `${rootName}/${dir.name}` : dir.name;
  const files = dir.files.map((file) => ({
    name: `${dirRoot}/${file.name}.${file.ext}`,
    content: file.content,
    ext: '',
  }));
  const filesInSub = dir.dirs.map((subDir) => flatFiles(`${dirRoot}`, subDir));
  const result = files.concat(...filesInSub);

  return result;
}

function displayResultInConsole(root, fileName) {
  const files = flatFiles('.', root);
  files.forEach((file) => {
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

function getComponentsMap() {
  const assetJson = fs.readFileSync('./demo/assets.json', { encoding: 'utf8' });
  const assets = JSON.parse(assetJson);
  const { components } = assets;

  const componentsMap = components
    .filter((c) => !!c.npm)
    .map((c) => ({
      componentName: c.componentName,
      ...(c.npm || {}),
    }));

  return componentsMap;
}

function main() {
  const schemaJson = fs.readFileSync('./demo/sampleSchema.json', { encoding: 'utf8' });
  const createIceJsProjectBuilder = CodeGenerator.solutions.icejs;
  const builder = createIceJsProjectBuilder();

  builder.generateProject(schemaJson).then((result) => {
    displayResultInConsole(result);
    writeResultToDisk(result, 'output/lowcodeDemo').then((response) => console.log('Write to disk: ', JSON.stringify(response)),);
    return result;
  });
}

function demo() {
  const schemaJson = fs.readFileSync('./demo/schema.json', { encoding: 'utf8' });
  const createIceJsProjectBuilder = CodeGenerator.solutions.icejs;
  const builder = createIceJsProjectBuilder();

  const componentsMap = getComponentsMap();
  const root = JSON.parse(schemaJson);

  const fullSchema = {
    version: '1.0.0',
    config: {
      historyMode: 'hash',
      targetRootID: 'J_Container',
    },
    meta: {
      name: 'demoproject',
    },
    componentsTree: [root],
    componentsMap,
  };

  builder.generateProject(fullSchema).then((result) => {
    displayResultInConsole(result);
    return result;
  });
}

function exportModule() {
  const schemaJson = fs.readFileSync('./demo/shenmaSample.json', { encoding: 'utf8' });
  const moduleBuilder = CodeGenerator.createModuleBuilder({
    plugins: [
      CodeGenerator.plugins.react.reactCommonDeps(),
      CodeGenerator.plugins.common.esmodule({
        fileType: 'jsx',
      }),
      CodeGenerator.plugins.react.containerClass(),
      CodeGenerator.plugins.react.containerInitState(),
      CodeGenerator.plugins.react.containerLifeCycle(),
      CodeGenerator.plugins.react.containerMethod(),
      CodeGenerator.plugins.react.jsx(),
      CodeGenerator.plugins.style.css(),
    ],
    postProcessors: [CodeGenerator.postprocessor.prettier()],
    mainFileName: 'index',
  });

  moduleBuilder.generateModuleCode(schemaJson).then((result) => {
    displayResultInConsole(result);
    return result;
  });
}

function exportProject() {
  const schemaJson = fs.readFileSync('./demo/sampleSchema.json', { encoding: 'utf8' });

  const builder = CodeGenerator.createProjectBuilder({
    template: CodeGenerator.solutionParts.icejs.template,
    plugins: {
      components: [
        CodeGenerator.plugins.react.reactCommonDeps(),
        CodeGenerator.plugins.common.esmodule({
          fileType: 'jsx',
        }),
        CodeGenerator.plugins.react.containerClass(),
        CodeGenerator.plugins.react.containerInitState(),
        CodeGenerator.plugins.react.containerLifeCycle(),
        CodeGenerator.plugins.react.containerMethod(),
        CodeGenerator.plugins.react.jsx(),
        CodeGenerator.plugins.style.css(),
      ],
      pages: [
        CodeGenerator.plugins.react.reactCommonDeps(),
        CodeGenerator.plugins.common.esmodule({
          fileType: 'jsx',
        }),
        CodeGenerator.plugins.react.containerClass(),
        CodeGenerator.plugins.react.containerInitState(),
        CodeGenerator.plugins.react.containerLifeCycle(),
        CodeGenerator.plugins.react.containerMethod(),
        CodeGenerator.plugins.react.jsx(),
        CodeGenerator.plugins.style.css(),
      ],
      router: [CodeGenerator.plugins.common.esmodule(), CodeGenerator.solutionParts.icejs.plugins.router()],
      entry: [CodeGenerator.solutionParts.icejs.plugins.entry()],
      constants: [CodeGenerator.plugins.project.constants()],
      utils: [CodeGenerator.plugins.common.esmodule(), CodeGenerator.plugins.project.utils()],
      i18n: [CodeGenerator.plugins.project.i18n()],
      globalStyle: [CodeGenerator.solutionParts.icejs.plugins.globalStyle()],
      htmlEntry: [CodeGenerator.solutionParts.icejs.plugins.entryHtml()],
      packageJSON: [CodeGenerator.solutionParts.icejs.plugins.packageJSON()],
    },
    postProcessors: [CodeGenerator.postprocessor.prettier()],
  });

  builder.generateProject(schemaJson).then((result) => {
    displayResultInConsole(result);
    writeResultToDisk(result, 'output/lowcodeDemo').then((response) => console.log('Write to disk: ', JSON.stringify(response)),);
    return result;
  });
}

// main();
// exportModule();
// exportProject();
demo();
