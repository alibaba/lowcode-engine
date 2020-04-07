import spawn from 'cross-spawn-promise';
import { ensureDir, ensureFile, writeFile } from 'fs-extra';
import { join } from 'path';
import semver from 'semver';
import uuid from 'short-uuid';
import { debug, OtterError } from './otter-core';
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
  tempDir: string;
  pkgName: string;
  pkgVersion: string;
  npmClient?: string;
}): Promise<void> {
  // 创建临时组件包
  const tempDir = params.tempDir;
  const pkgJsonFilePath = join(tempDir, 'package.json');
  await ensureFile(pkgJsonFilePath);
  await writeFile(
    pkgJsonFilePath,
    JSON.stringify({
      name: params.pkgName,
      version: params.pkgVersion || '0.0.0',
      dependencies: {
        [params.pkgName]: params.pkgVersion || 'latest',
      },
    }),
  );

  // 安装依赖
  const npmClient = params.npmClient || 'tnpm';
  await spawn(npmClient, ['i'], { stdio: 'inherit', cwd: tempDir } as any);
}

/**
 * 创建临时目录
 *
 * @private
 * @returns {Promise<string>} 返回临时文件夹路径
 * @memberof LocalGenerator
 */
export async function createTempDir(): Promise<string> {
  const tempDirName = uuid.generate();
  const tempDir = join(__dirname, '../../node_modules/.temp/', tempDirName);
  await ensureDir(tempDir);
  log('create temp dir successfully', tempDir);
  return tempDir;
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
  const matches = pkgNameWithVersion.match(/(@\d+\.\d+\.\d+)$/);
  if (!matches) {
    return {
      name: pkgNameWithVersion,
    };
  }
  const semverObj = semver.coerce(matches[0]);
  const name = pkgNameWithVersion.replace(matches[0], '');
  return {
    version: semverObj && semverObj.version,
    name,
  };
}

// 将问题转化为本地物料化场景
export default async function localize(options: IMaterializeOptions): Promise<string> {
  // 创建临时目录
  const tempDir = await createTempDir();
  // 创建组件包
  const { name, version } = getPkgNameAndVersion(options.entry);
  await createFakePackage({
    pkgName: name,
    pkgVersion: version,
    tempDir,
    npmClient: options.npmClient,
  });

  return join(tempDir, 'node_modules', name);
}
