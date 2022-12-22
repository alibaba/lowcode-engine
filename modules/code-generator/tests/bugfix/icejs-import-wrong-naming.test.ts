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
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Bar',
          main: 'lib/index.js',
          destructuring: false,
          subName: '',
          componentName: 'Foo',
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain('import Foo from \'example-package/lib/index.js\';');
  });

  test('named import with no alias', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Foo',
          main: 'lib/index.js',
          destructuring: true,
          subName: '',
          componentName: 'Foo',
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain(
      'import { Foo } from \'example-package/lib/index.js\';',
    );
  });

  test('named import with alias', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Bar',
          main: 'lib/index.js',
          destructuring: true,
          subName: '',
          componentName: 'Foo',
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain(
      'import { Bar as Foo } from \'example-package/lib/index.js\';',
    );
  });

  test('default import with same name', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Foo',
          main: 'lib/index.js',
          destructuring: false,
          subName: '',
          componentName: 'Foo',
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain('import Foo from \'example-package/lib/index.js\';');
  });

  test('default import with sub name and export name', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Bar',
          main: 'lib/index.js',
          destructuring: false,
          subName: 'Baz',
          componentName: 'Foo',
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain('import Bar from \'example-package/lib/index.js\';');

    expect(generatedPageFileContent).toContain('const Foo = Bar.Baz;');
  });

  test('default import with sub name without export name', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          main: 'lib/index.js',
          destructuring: false,
          exportName: '',
          subName: 'Baz',
          componentName: 'Foo',
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain(
      'import __$examplePackage_default from \'example-package/lib/index.js\';',
    );

    expect(generatedPageFileContent).toContain('const Foo = __$examplePackage_default.Baz;');
  });

  test('named import with sub name', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Bar',
          main: 'lib/index.js',
          destructuring: true,
          subName: 'Baz',
          componentName: 'Foo',
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain(
      'import { Bar } from \'example-package/lib/index.js\';',
    );

    expect(generatedPageFileContent).toContain('const Foo = Bar.Baz;');
  });

  test('default imports with different componentName', async () => {
    await exportProject(inputSchemaJsonFile, outputDir, {
      componentsMap: [
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Bar',
          destructuring: false,
          componentName: 'Foo',
        },
        {
          package: 'example-package',
          version: '1.2.3',
          exportName: 'Bar',
          destructuring: false,
          componentName: 'Baz',
        },
      ],
      componentsTree: [
        {
          componentName: 'Page',
          fileName: 'test',
          dataSource: { list: [] },
          children: [{ componentName: 'Foo' }, { componentName: 'Baz' }],
        },
      ],
    });

    const generatedPageFileContent = readOutputTextFile('demo-project/src/pages/Test/index.jsx');
    expect(generatedPageFileContent).toContain('import Foo from \'example-package\';');
    expect(generatedPageFileContent).toContain('import Baz from \'example-package\';');

    expect(generatedPageFileContent).not.toContain('const Foo =');
    expect(generatedPageFileContent).not.toContain('const Baz =');
  });
});

function exportProject(
  importPath: string,
  outputPath: string,
  mergeSchema?: Partial<IPublicTypeProjectSchema>,
) {
  const schemaJsonStr = fs.readFileSync(importPath, { encoding: 'utf8' });
  const schema = { ...JSON.parse(schemaJsonStr), ...mergeSchema };
  const builder = CodeGenerator.solutions.icejs();

  return builder.generateProject(schema).then(async (result) => {
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

function readOutputTextFile(outputFilePath: string): string {
  return fs.readFileSync(path.resolve(outputDir, outputFilePath), 'utf-8');
}
