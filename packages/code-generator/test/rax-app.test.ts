import test from 'ava';
import { spawnSync } from 'child_process';
import fs from 'fs';
import glob from 'glob';
import JSON from 'json5';
import path from 'path';

import CodeGenerator from '../src';
import createRaxAppBuilder from '../src/solutions/rax-app';
import { IProjectSchema } from '../src/types/schema';

const TEST_CASES_DIR = path.join(__dirname, '../test-cases/rax-app');

async function exportProject(schemaJson: IProjectSchema, targetPath: string, projectName: string) {
  const raxAppBuilder = createRaxAppBuilder();
  const result = await raxAppBuilder.generateProject(schemaJson);
  const publisher = CodeGenerator.publishers.disk();
  await publisher.publish({
    project: result,
    outputPath: targetPath,
    projectSlug: projectName,
    createProjectFolder: true,
  });
}

const defineTest = (caseDirName: string) => {
  test(`rax-app ${caseDirName} should works`, async (t) => {
    const caseFullDir = path.join(TEST_CASES_DIR, caseDirName);
    const schema = JSON.parse(fs.readFileSync(path.join(caseFullDir, 'schema.json5'), 'utf-8'));
    const actualDir = path.join(caseFullDir, 'actual');

    await exportProject(schema, actualDir, 'demo-project');

    const actualFiles = glob.sync('**/*.{js,jsx,json,ts,tsx,less,css,scss,sass}', { cwd: actualDir });

    t.true(actualFiles.length > 0)

    spawnSync('npx', ['prettier', '--write', ...actualFiles], {
      stdio: 'inherit',
      shell: true,
      cwd: actualDir,
    });

    const diffRes = spawnSync('diff', ['-bur', 'actual', 'expected'], {
      stdio: 'pipe',
      shell: true,
      cwd: caseFullDir,
      encoding: 'utf-8',
    });

    t.is(diffRes.stdout, '')
  });
};

test('simple truth should pass', async (t) => {
  t.is(0, 0);
});

fs.readdirSync(TEST_CASES_DIR).forEach(defineTest);

