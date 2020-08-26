import spawn from 'cross-spawn-promise';
import { ensureDir, ensureFile, writeFile } from 'fs-extra';
import { join } from 'path';
import semver from 'semver';
import uuid from 'short-uuid';
import { debug } from './core';
import { IMaterializeOptions } from './types';

const log = debug.extend('mat');

/**
 * 创建组件包
 *
 * @private
 * @param {{
 *     pkgName: string;
 *     pkgVersion: string;
 *   }} params
 * @returns {Promise<void>}
 * @memberof OnlineAccesser
 */
export async function createFakePackage(params: {
  workDir: string;
  pkgName: string;
  pkgVersion: string;
  npmClient?: string;
}): Promise<void> {
  // 创建临时组件包
  const workDir = params.workDir;
  const pkgJsonFilePath = join(workDir, 'package.json');
  await ensureFile(pkgJsonFilePath);
  await writeFile(
    pkgJsonFilePath,
    JSON.stringify(
      {
        name: params.pkgName,
        version: params.pkgVersion || '0.0.0',
        dependencies: {
          [params.pkgName]: params.pkgVersion || 'latest',
          react: 'latest',
          'react-dom': 'latest',
          'parse-prop-types': '^0.3.0',
          typesync: 'latest',
        },
      },
      null,
      2,
    ),
  );

  // 安装依赖
  const npmClient = params.npmClient || 'tnpm';
  await spawn(npmClient, ['i'], { stdio: 'inherit', cwd: workDir } as any);
}

/**
 * 创建临时目录
 *
 * @private
 * @returns {Promise<string>} 返回临时文件夹路径
 * @memberof LocalGenerator
 */
export async function createworkDir(): Promise<string> {
  const workDirName = uuid.generate();
  const workDir = join(__dirname, '../../node_modules/.temp/', workDirName);
  await ensureDir(workDir);
  log('create temp dir successfully', workDir);
  return workDir;
}

/**
 * 分离物料组件名称和版本号
 *
 * @private
 * @param {string} pkgNameWithVersion
 * @returns {{ [key: string]: any }}
 * @memberof OnlineAccesser
 */
export function getPkgNameAndVersion(pkgNameWithVersion: string): { [key: string]: any } {
  const matches = pkgNameWithVersion.match(/(@[^/]+)$/);
  if (!matches) {
    return {
      name: pkgNameWithVersion,
    };
  }
  const name = pkgNameWithVersion.replace(matches[0], '');
  return {
    version: matches[0].slice(1),
    name,
  };
}

// 将问题转化为本地物料化场景
export default async function localize(
  options: IMaterializeOptions,
): Promise<{
  workDir: string;
  moduleDir: string;
}> {
  // 创建临时目录
  const workDir = await createworkDir();
  // 创建组件包
  const { name, version } = getPkgNameAndVersion(options.entry);
  await createFakePackage({
    pkgName: name,
    pkgVersion: version,
    workDir,
    npmClient: options.npmClient,
  });

  return {
    workDir,
    moduleDir: join(workDir, 'node_modules', name),
  };
}
