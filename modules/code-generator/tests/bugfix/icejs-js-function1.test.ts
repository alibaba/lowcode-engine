import CodeGenerator from '../../src';
import * as fs from 'fs';
import * as path from 'path';
import { createDiskPublisher } from '../helpers/solutionHelper';

const testCaseBaseName = path.basename(__filename, '.test.ts');

test(testCaseBaseName, async () => {
  const inputSchemaJsonFile = path.join(__dirname, `${testCaseBaseName}.schema.json`);
  const outputDir = path.join(__dirname, `${testCaseBaseName}.generated`);
  await exportProject(inputSchemaJsonFile, outputDir);

  const generatedPageFileContent = fs.readFileSync(
    path.join(outputDir, 'demo-project/src/pages/Test/index.jsx'),
    'utf-8',
  );
  expect(generatedPageFileContent).toContain(`
                                  onClick={function () {
                                    this.linkHandler.apply(
                                      this,
                                      Array.prototype.slice
                                        .call(arguments)
                                        .concat([record])
                                    );
                                  }.bind(__$$context)}`);
});

function exportProject(inputPath: string, outputPath: string) {
  const schemaJson = fs.readFileSync(inputPath, { encoding: 'utf8' });
  const newSchema = schemaJson;
  const builder = CodeGenerator.solutions.icejs();

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
