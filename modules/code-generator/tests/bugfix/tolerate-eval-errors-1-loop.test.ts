import CodeGenerator from '../../src';
import * as fs from 'fs';
import * as path from 'path';
import { IPublicTypeProjectSchema } from '@alilc/lowcode-types';
import { createDiskPublisher } from '../helpers/solutionHelper';
import { IceJsProjectBuilderOptions } from '../../src/solutions/icejs';

const testCaseBaseName = path.basename(__filename, '.test.ts');
const inputSchemaJsonFile = path.join(__dirname, `${testCaseBaseName}.schema.json`);
const outputDir = path.join(__dirname, `${testCaseBaseName}.generated`);

jest.setTimeout(60 * 60 * 1000);

test('loop should be generated link __$$evalArray(xxx).map', async () => {
  await exportProject(
    inputSchemaJsonFile,
    outputDir,
    {},
    { inStrictMode: true, tolerateEvalErrors: true },
  );

  const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
  expect(generatedPageFileContent).toContain(
    '{__$$evalArray(() => this.state.users).map((item, index) =>',
  );
});

function exportProject(
  importPath: string,
  outputPath: string,
  mergeSchema?: Partial<IPublicTypeProjectSchema>,
  options?: IceJsProjectBuilderOptions,
) {
  const schemaJsonStr = fs.readFileSync(importPath, { encoding: 'utf8' });
  const schema = { ...JSON.parse(schemaJsonStr), ...mergeSchema };
  const builder = CodeGenerator.solutions.icejs(options);

  return builder.generateProject(schema).then(async (result) => {
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

function readOutputTextFile(outputFilePath: string): string {
  return fs.readFileSync(path.resolve(outputDir, outputFilePath), 'utf-8');
}
