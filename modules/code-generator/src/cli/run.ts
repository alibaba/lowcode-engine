/* eslint-disable no-console */
import chalk from 'chalk';
import * as fs from 'fs-extra';
import JSON5 from 'json5';
import { jsonc } from 'jsonc';
import { spawnSync } from 'child_process';
import * as path from 'path';

import { getErrorMessage } from '../utils/errors';
import CodeGenerator from '..';
import type { IProjectBuilder } from '..';
import type { IPublicTypeProjectSchema } from '@alilc/lowcode-types';

/**
 * 执行出码 CLI 命令
 * @param args 入参数组
 * @param options 选项
 * @returns {Promise<number>} 错误码
 */
export async function run(
  args: string[],
  options: {
    solution: string;
    input?: string;
    output?: string;
    quiet?: boolean;
    verbose?: boolean;
    solutionOptions?: string;
  },
): Promise<number> {
  try {
    const schemaFile = options.input || args[0];
    if (!schemaFile) {
      throw new Error(
        'a schema file must be specified by `--input <schema.json>` or by the first positional argument',
      );
    }

    if ((options.input && args.length > 0) || args.length > 1) {
      throw new Error(
        'only one schema file can be specified, either by `--input <schema.json>` or by the first positional argument',
      );
    }

    let solutionOptions = {};

    if (options.solutionOptions) {
      try {
        solutionOptions = JSON.parse(options.solutionOptions);
      } catch (err: any) {
        throw new Error(
          `solution options parse error, error message is "${err.message}"`,
        );
      }
    }


    // 读取 Schema
    const schema = await loadSchemaFile(schemaFile);

    // 创建一个项目构建器
    const createProjectBuilder = await getProjectBuilderFactory(options.solution, {
      quiet: options.quiet,
    });
    const builder = createProjectBuilder(solutionOptions);

    // 生成代码
    const generatedSourceCodes = await builder.generateProject(schema);

    // 输出到磁盘
    const publisher = CodeGenerator.publishers.disk();

    await publisher.publish({
      project: generatedSourceCodes,
      outputPath: options.output || 'generated',
      projectSlug: 'example',
      createProjectFolder: false,
    });
    return 0;
  } catch (e) {
    console.log(chalk.red(getErrorMessage(e) || `Unexpected error: ${e}`));
    if (typeof e === 'object' && (e as { stack: string } | null)?.stack && options.verbose) {
      console.log(chalk.gray((e as { stack: string }).stack));
    }
    return 1;
  }
}

async function getProjectBuilderFactory(
  solution: string,
  { quiet }: { quiet?: boolean },
): Promise<(options: {[prop: string]: any}) => IProjectBuilder> {
  if (solution in CodeGenerator.solutions) {
    return CodeGenerator.solutions[solution as 'icejs' | 'rax'];
  }

  const solutionPackageName = isLocalSolution(solution)
    ? solution
    : `${solution.startsWith('@') ? solution : `@alilc/lowcode-solution-${solution}`}`;

  if (!isLocalSolution(solution)) {
    if (!quiet) {
      console.log(`"${solution}" is not internal, installing it as ${solutionPackageName}...`);
    }

    spawnSync('npm', ['i', solutionPackageName], {
      stdio: quiet ? 'ignore' : 'inherit',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const solutionExports = require(!isLocalSolution(solution)
    ? solutionPackageName
    : `${path.isAbsolute(solution) ? solution : path.join(process.cwd(), solution)}`);

  const projectBuilderFactory =
    solutionExports.createProjectBuilder ||
    solutionExports.createAppBuilder ||
    solutionExports.default;

  if (typeof projectBuilderFactory !== 'function') {
    throw new Error(
      `"${solutionPackageName}" should export project builder factory via named export 'createProjectBuilder' or via default export`,
    );
  }

  return projectBuilderFactory;
}

function isLocalSolution(solution: string) {
  return solution.startsWith('.') || solution.startsWith('/') || solution.startsWith('~');
}

async function loadSchemaFile(schemaFile: string): Promise<IPublicTypeProjectSchema> {
  if (!schemaFile) {
    throw new Error('invalid schema file name');
  }

  const schemaFileContent = await fs.readFile(schemaFile, 'utf8');

  if (/\.json5/.test(schemaFile)) {
    return JSON5.parse(schemaFileContent);
  }

  // 默认用 JSONC 的格式解析（兼容 JSON）
  return jsonc.parse(schemaFileContent);
}
