import spawn from 'cross-spawn-promise';
import { ensureDir, ensureFile, writeFile } from 'fs-extra';
import { join } from 'path';
import semver from 'semver';
import uuid from 'short-uuid';
import { debug, IComponentMaterial, OtterError } from '../otter-core';
import { IMaterializeOptions } from '../types';
import BaseAccesser from './BaseAccesser';
import LocalAccesser from './LocalAccesser';

const log = debug.extend('mat');

/**
 * 在线接入
 * @class OnlineAccesser
 * @extends {BaseAccesser}
 */
class OnlineAccesser extends BaseAccesser {
  /**
   * 临时目录
   *
   * @private
   * @type {string}
   * @memberof OnlineAccesser
   */
  private tempDir: string = '';

  public async access(): Promise<IComponentMaterial> {
    // 创建临时目录
    this.tempDir = await this.createTempDir();
    // 创建组件包
    const { name, version } = this.getPkgNameAndVersion(this.options.entry);
    await this.createFakePackage({
      pkgName: name,
      pkgVersion: version,
    });
    // 将问题转化为本地物料化场景
    const options: IMaterializeOptions = {
      cwd: this.tempDir,
      entry: join(this.tempDir, 'node_modules', name),
      accesser: 'local',
      isExportedAsMultiple: this.options.isExportedAsMultiple,
    };
    const localAccesser = new LocalAccesser(options);
    return localAccesser.access();
  }

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
  private async createFakePackage(params: {
    pkgName: string;
    pkgVersion: string;
  }): Promise<void> {
    // 创建临时组件包
    const tempDir = this.tempDir;
    const pkgJsonFilePath = join(tempDir, 'package.json');
    await ensureFile(pkgJsonFilePath);
    await writeFile(
      pkgJsonFilePath,
      JSON.stringify({
        name: params.pkgName,
        version: params.pkgVersion,
        dependencies: {
          [params.pkgName]: params.pkgVersion,
        },
      }),
    );
    // 安装依赖
    const npmClient = this.options.npmClient || 'tnpm';
    await spawn(npmClient, ['i'], { stdio: 'inherit', cwd: tempDir } as any);
  }

  /**
   * 创建临时目录
   *
   * @private
   * @returns {Promise<string>} 返回临时文件夹路径
   * @memberof LocalGenerator
   */
  private async createTempDir(): Promise<string> {
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
  private getPkgNameAndVersion(
    pkgNameWithVersion: string,
  ): { [key: string]: any } {
    const matches = pkgNameWithVersion.match(/(@\d+\.\d+\.\d+)$/);
    if (!matches) {
      throw new OtterError(`Illegal semver version: ${pkgNameWithVersion}`);
    }
    const semverObj = semver.coerce(matches[0]);
    const name = pkgNameWithVersion.replace(matches[0], '');
    return {
      version: semverObj && semverObj.version,
      name,
    };
  }
}

export default OnlineAccesser;
