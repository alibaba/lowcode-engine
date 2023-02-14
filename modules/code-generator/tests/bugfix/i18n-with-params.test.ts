import CodeGenerator from '../../src';
import * as fs from 'fs';
import * as path from 'path';
import { IPublicTypeProjectSchema } from '@alilc/lowcode-types';
import { createDiskPublisher } from '../helpers/solutionHelper';

const testCaseBaseName = path.basename(__filename, '.test.ts');
const inputSchemaJsonFile = path.join(__dirname, `${testCaseBaseName}.schema.json`);
const outputDir = path.join(__dirname, `${testCaseBaseName}.generated`);

jest.setTimeout(60 * 60 * 1000);

describe(testCaseBaseName, () => {
  test('default import', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {});

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain(
      `
        <Greetings
          content={this._i18nText({
            key: 'greetings.hello',
            params: { name: this.state.name },
          })}
        />
      `.trim(),
    );
  });
});

function exportProject(
  importPath: string,
  outputPath: string,
  mergeSchema?: Partial<IPublicTypeProjectSchema>,
) {
  const schemaJsonStr = fs.readFileSync(importPath, { encoding: 'utf8' });
  const schema = { ...JSON.parse(schemaJsonStr), ...mergeSchema };
  const builder = CodeGenerator.solutions.icejs({ tolerateEvalErrors: false });

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
