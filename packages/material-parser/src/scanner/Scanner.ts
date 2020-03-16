import { pathExists, readFile, statSync } from 'fs-extra';
import { dirname, join } from 'path';
import { debug } from '../otter-core';
import BaseParser from '../parser/BaseParser';
import ReactParser from '../parser/ReactParser';
import {
  IMaterializeOptions,
  IMaterialScanModel,
  IScanner,
  SourceType,
} from '../types';

const log = debug.extend('mat');

/**
 * 文件扫描器
 *
 * @class Scanner
 * @implements {IScanner}
 */
class Scanner implements IScanner {
  public options: IMaterializeOptions;

  constructor(options: IMaterializeOptions) {
    this.options = options;
  }

  public async scan(): Promise<IMaterialScanModel> {
    const model: IMaterialScanModel = {
      pkgName: '',
      pkgVersion: '',
      mainEntry: '',
      sourceType: SourceType.MODULE,
      modules: [],
    };
    const options = this.options;
    log('options', options);
    // 入口文件路径
    let entryFilePath = null;
    const cwd = options.cwd ? options.cwd : '';
    const entry = options.entry;
    const isDepsMode = cwd !== entry;
    const pkgJsonPath = join(cwd, 'package.json');
    // 判断是否存在 package.json
    if (!(await pathExists(pkgJsonPath))) {
      throw new Error(`Cannot find package.json. ${pkgJsonPath}`);
    }
    // 读取 package.json
    let pkgJson = await this.resolvePkgJson(pkgJsonPath);
    model.pkgName = pkgJson.name;
    model.pkgVersion = pkgJson.version;
    if (isDepsMode) {
      pkgJson = await this.resolvePkgJson(join(entry, 'package.json'));
    }
    if (pkgJson.module) {
      // 支持 es module
      model.sourceType = SourceType.MODULE;
      entryFilePath = pkgJson.module;
    } else if (pkgJson.main) {
      // 支持 commonjs
      model.sourceType = SourceType.MAIN;
      entryFilePath = pkgJson.main;
    } else {
      entryFilePath = './index.js';
    }
    entryFilePath = join(isDepsMode ? entry : cwd, entryFilePath);
    log('entryFilePath', entryFilePath);
    const entryFile = await this.loadFile(entryFilePath);
    log('entryFile', entryFile);
    model.mainEntry = entryFilePath;
    // 记录入口文件
    // model.modules.push({
    //   filePath: entryFilePath,
    //   fileContent: entryFile,
    // });
    log('model', model);
    // debugger;
    if (options.isExportedAsMultiple) {
      // 解析 entryFile，提取出 export 语句
      const modules = await this.parseEntryFile({
        entryFile,
        entryFilePath,
        sourceType: model.sourceType,
      });
      model.modules.push(...modules);
    }
    log('model', model);
    return model;
  }

  /**
   * 判断是否为文件夹
   * @param {string} filePath 文件路径
   * @returns {Promise<boolean>}
   * @memberof LocalScanner
   */
  public async isDirectory(filePath: string): Promise<boolean> {
    log('materialIn', 'isDirectory - filePath', filePath);
    const stats = statSync(filePath);
    return stats.isDirectory();
  }

  public async loadFile(filePath: string): Promise<string> {
    const content: string | Buffer = await readFile(filePath);
    if (typeof content === 'string') {
      return content;
    }
    return content.toString();
  }

  public async resolvePkgJson(
    pkgJsonPath: string,
  ): Promise<{ [k: string]: any }> {
    const content = await this.loadFile(pkgJsonPath);
    const json = JSON.parse(content);
    return json;
  }

  /**
   * 解析入口文件，获取要导出的模块内容
   * @private
   * @param {{
   *     entryFile: string;
   *     entryFilePath: string;
   *     sourceType: string;
   *   }} params
   * @returns {Promise<any>}
   * @memberof LocalScanner
   */
  private async parseEntryFile(params: {
    entryFile: string;
    entryFilePath: string;
    sourceType: string;
  }): Promise<any> {
    const modules: any = [];
    const entryFileDirName = dirname(params.entryFilePath);
    const ecology = await BaseParser.recognizeEcology(this.options);
    if (ecology === 'react') {
      const exportedList = await ReactParser.parseExportedStatement(
        params.entryFile,
        params.sourceType,
      );
      if (Array.isArray(exportedList)) {
        for (const item of exportedList) {
          if (item.source && item.source.length) {
            try {
              let filePath = join(entryFileDirName, item.source);
              if (await this.isDirectory(filePath)) {
                filePath = join(filePath, 'index.js');
              } else {
                filePath = join(filePath, '.js');
              }
              debug('filePath', filePath);
              modules.push({
                filePath,
                fileContent: await this.loadFile(filePath),
              });
            } catch (e) {
              debug('error', 'parseEntryFile', e.message);
            }
          }
        }
      }
    }
    debug('modules', modules);
    return modules;
  }
}

export default Scanner;
