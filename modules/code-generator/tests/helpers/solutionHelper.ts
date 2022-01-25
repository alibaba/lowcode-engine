import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export { createDiskPublisher } from '../../src/publisher/disk';

export function removeActualDirRecursiveSync(actualDir: string, caseFullDir: string) {
  ensureShellExec('rm', ['-rf', actualDir], { cwd: caseFullDir });
}

export function runPrettierSync(files: string[], cwd: string) {
  ensureShellExec('npx', ['prettier', '--write', ...files], { cwd });
}

export function diffActualAndExpectedSync(caseFullDir: string): string {
  const res = spawnSync(
    'diff',
    ['-wBur', '-x', '.eslintrc.js', '-x', 'abc.json', 'expected', 'actual'],
    {
      cwd: caseFullDir,
      stdio: 'pipe',
      shell: true,
      encoding: 'utf-8',
    },
  );

  return colorizeDiffOutput(res.stdout);
}

export function ensureShellExec(
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
      } (Full command: "${shellCmd} ${args.join(' ')}" ) (stderr: ${res.stderr})`,
    );
  }

  return res;
}

export function colorizeDiffOutput(output: string): string {
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

export function getSubDirectoriesSync(baseDir: string) {
  return fs
    .readdirSync(baseDir)
    .filter((dirOrFileName: string) =>
      fs.statSync(path.join(baseDir, dirOrFileName)).isDirectory(),
    );
}

expect.extend({
  toBeSameFileContents(caseFullDir: string) {
    const differences = diffActualAndExpectedSync(caseFullDir);
    if (differences) {
      return {
        message: () => differences,
        pass: false,
      };
    } else {
      return {
        message: () => `expected case [${caseFullDir}] not to be same`,
        pass: true,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSameFileContents(): R;
    }
  }
}
