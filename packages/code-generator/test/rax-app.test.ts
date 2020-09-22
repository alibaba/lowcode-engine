import test from 'ava';
import { spawnSync } from 'child_process';
import fs from 'fs';
import glob from 'glob';
import JSON from 'json5';
import path from 'path';
import chalk from 'chalk';

import CodeGenerator from '../src';

import type { IProjectSchema } from '../src/types/schema';

const TEST_CASES_DIR = path.join(__dirname, '../test-cases/rax-app');

getSubDirectoriesSync(TEST_CASES_DIR).forEach(defineTest);

function defineTest(caseDirName: string) {
  test(`rax-app ${caseDirName} should works`, async (t) => {
    try {
      const caseFullDir = path.join(TEST_CASES_DIR, caseDirName);
      const schema = JSON.parse(fs.readFileSync(path.join(caseFullDir, 'schema.json5'), 'utf-8'));
      const actualDir = path.join(caseFullDir, 'actual');

      removeActualDirRecursiveSync(actualDir, caseFullDir);

      await exportProject(schema, actualDir, 'demo-project');

      const actualFiles = glob.sync('**/*.{js,jsx,json,ts,tsx,less,css,scss,sass}', { cwd: actualDir });

      t.true(actualFiles.length > 0);

      runPrettierSync(actualFiles, actualDir);

      const differences = diffActualAndExpectedSync(caseFullDir);
      if (differences) {
        t.fail(differences);
      }
    } catch (e) {
      throw e; // just for debugger
    }
  });
}

async function exportProject(schemaJson: IProjectSchema, targetPath: string, projectName: string) {
  const raxAppBuilder = CodeGenerator.solutions.rax();
  const result = await raxAppBuilder.generateProject(schemaJson);
  const publisher = CodeGenerator.publishers.disk();
  await publisher.publish({
    project: result,
    outputPath: targetPath,
    projectSlug: projectName,
    createProjectFolder: true,
  });
}

function removeActualDirRecursiveSync(actualDir: string, caseFullDir: string) {
  ensureShellExec('rm', ['-rf', actualDir], { cwd: caseFullDir });
}

function runPrettierSync(files: string[], cwd: string) {
  ensureShellExec('npx', ['prettier', '--write', ...files], { cwd });
}

function diffActualAndExpectedSync(caseFullDir: string): string {
  const res = spawnSync('diff', ['-wBur', '-x', '.eslintrc.js', 'expected', 'actual'], {
    cwd: caseFullDir,
    stdio: 'pipe',
    shell: true,
    encoding: 'utf-8',
  });

  return colorizeDiffOutput(res.stdout);
}

function ensureShellExec(
  shellCmd: string,
  args: string[],
  { cwd = process.cwd() }: { cwd?: string } = {},
): { stdout: string; stderr: string } {
  const res = spawnSync(shellCmd, args, {
    stdio: 'pipe',
    shell: true,
    cwd,
    encoding: 'utf-8',
  });

  if (res.status !== 0) {
    throw new Error(
      `Shell command "${shellCmd} ${args.slice(0, 2).join(' ')}..." failed with status: ${
        res.status
      } (Full command: "${shellCmd} ${args.join(' ')}" )`,
    );
  }

  return res;
}

function colorizeDiffOutput(output: string): string {
  if (!output) {
    return output;
  }

  return output
    .split('\n')
    .map((line) => {
      if (/^Only/i.test(line)) {
        return chalk.red(line);
      } else if (line[0] === '+') {
        return chalk.yellow(line);
      } else if (line[0] === '-') {
        return chalk.red(line);
      } else {
        return line;
      }
    })
    .join('\n');
}

function getSubDirectoriesSync(baseDir: string) {
  return fs
    .readdirSync(baseDir)
    .filter((dirOrFileName: string) => fs.statSync(path.join(baseDir, dirOrFileName)).isDirectory());
}
