import CodeGenerator from '../../src';
import * as fs from 'fs';
import * as path from 'path';
import { createDiskPublisher } from '../helpers/solutionHelper';

test('page-element1', async () => {
  const inputSchemaJsonFile = path.join(__dirname, 'page-element1.schema.json');
  const outputDir = path.join(__dirname, 'page-element1.generated');
  await exportProject(inputSchemaJsonFile, outputDir);

  const generatedPageFileContent = fs.readFileSync(
    path.join(outputDir, 'demo-project/src/pages/$/index.jsx'),
    'utf-8',
  );
  expect(generatedPageFileContent).toContain('<Page');
});

function exportProject(inputPath: string, outputPath: string) {
  const schemaJson = fs.readFileSync(inputPath, { encoding: 'utf8' });
  const newSchema = schemaJson;
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
        CodeGenerator.plugins.react.jsx({
          nodeTypeMapping: {
            Div: 'div',
            Component: 'div',
            Block: 'div',
          },
        }),
        CodeGenerator.plugins.style.css(),
      ],
      router: [
        CodeGenerator.plugins.common.esmodule(),
        CodeGenerator.solutionParts.icejs.plugins.router(),
      ],
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

  return builder.generateProject(newSchema).then(async (result) => {
    // displayResultInConsole(result);
    const publisher = createDiskPublisher();
    await publisher.publish({
      project: result,
      outputPath,
      projectSlug: 'demo-project',
      createProjectFolder: true,
    });
    return result;
  });
}
