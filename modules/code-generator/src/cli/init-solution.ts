/* eslint-disable no-console */
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import * as changeCase from 'change-case';
import { getErrorMessage } from '../utils/errors';
import { getLowcodeSolutionTemplateFiles } from './solutions/example-solution';


export async function initSolution(args: string[], options: {
  quiet?: boolean;
  verbose?: boolean;
}) {
  try {
    const cwd = process.cwd();
    let solutionName = args[0] || 'hello';
    let solutionPath = path.resolve(cwd, solutionName);
    if (solutionName === '.') {
      solutionName = path.basename(cwd);
      solutionPath = cwd;
    }

    const modifyFileContent = (content: string) =>
      content
        .replace(/hello-world/g, changeCase.paramCase(solutionName))
        .replace(/HelloWorld/g, changeCase.pascalCase(solutionName))
        .replace(/Hello World/g, changeCase.titleCase(solutionName));

    await ensureDirExists(solutionPath);

    const templateFiles = getLowcodeSolutionTemplateFiles();
    for (const templateFile of templateFiles) {
      if (options.verbose) {
        console.log('%s', chalk.gray(`creating file ${templateFile.file}`));
      }

      const templateFilePath = path.join(solutionPath, templateFile.file);
      await ensureDirExists(path.dirname(templateFilePath));
      await fs.writeFile(templateFilePath, modifyFileContent(templateFile.content), { encoding: 'utf-8' });
    }

    if (!options.quiet) {
      console.log('%s', chalk.green(`solution ${solutionName} created successfully`));
    }

    return 0;
  } catch (e) {
    console.log(chalk.red(getErrorMessage(e) || `Unexpected error: ${e}`));
    if (typeof e === 'object' && (e as { stack: string } | null)?.stack && options.verbose) {
      console.log(chalk.gray((e as { stack: string }).stack));
    }
    return 1;
  }
}

async function ensureDirExists(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (e) {
    if ((e as { code: string }).code === 'EEXIST') {
      return;// ignore existing error
    }
    throw e;
  }
}