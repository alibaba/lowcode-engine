import test from 'ava';
import { spawnSync } from 'child_process';
import fs from 'fs';
import glob from 'glob';
import JSON from 'json5';
import path from 'path';
import chalk from 'chalk';

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
    try {
      const caseFullDir = path.join(TEST_CASES_DIR, caseDirName);
      const schema = JSON.parse(fs.readFileSync(path.join(caseFullDir, 'schema.json5'), 'utf-8'));
      const actualDir = path.join(caseFullDir, 'actual');

      removeActualDirRecursiveSync(actualDir, caseFullDir);

      await exportProject(schema, actualDir, 'demo-project');

      const actualFiles = glob.sync('**/*.{js,jsx,json,ts,tsx,less,css,scss,sass}', { cwd: actualDir });

      t.true(actualFiles.length > 0)

      runPrettierSync(actualFiles, actualDir);

      const diffRes = diffActualAndExpectedSync(caseFullDir);
      if (diffRes) {
        t.fail(diffRes);
      } else {
        t.pass();
      }
    } catch(e){
      throw e; // just for debugger
    }
  });
};

test('simple truth should pass', async (t) => {
  t.is(0, 0);
});

fs.readdirSync(TEST_CASES_DIR).forEach(defineTest);

function removeActualDirRecursiveSync(actualDir: string, caseFullDir: string) {
  spawnSync('rm', ['-rf', actualDir], {
    stdio: 'inherit',
    shell: true,
    cwd: caseFullDir
  });
}

function runPrettierSync(files: string[], cwd: string) {
  spawnSync('npx', ['prettier', '--write', ...files], {
    stdio: 'inherit',
    shell: true,
    cwd,
  });
}

function diffActualAndExpectedSync(caseFullDir: string): string {
  const res = spawnSync('diff', ['-wur', 'expected', 'actual'], {
    stdio: 'pipe',
    shell: true,
    cwd: caseFullDir,
    encoding: 'utf-8',
  });

  return colorizeDiffOutput(res.stdout);
}

function colorizeDiffOutput(output: string): string {
  if (!output){
    return output;
  }

  return output.split('\n').map(line => {
    if (/^Only/i.test(line)){
      return chalk.red(line);
    } else if (line[0] === '+'){
      return chalk.yellow(line);
    } else if (line[0] === '-'){
      return chalk.red(line);
    } else {
      return line;
    }
  }).join('\n');
}

