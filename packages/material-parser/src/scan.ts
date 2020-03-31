import { IMaterializeOptions, IMaterialScanModel, SourceType } from './types';
import { pathExists, readFile, lstatSync } from 'fs-extra';
import { join } from 'path';
import { debug } from './otter-core';
const log = debug.extend('mat');

export default async function scan(options: IMaterializeOptions): Promise<IMaterialScanModel> {
  const model: IMaterialScanModel = {
    pkgName: '',
    pkgVersion: '',
    sourceType: SourceType.MODULE,
    entryFilePath: '',
    entryFileContent: '',
  };
  log('options', options);
  // 入口文件路径
  let entryFilePath = options.entry;
  const stats = lstatSync(entryFilePath);
  debugger;
  if (!stats.isFile()) {
    let mainFilePath = '';
    const pkgJsonPath = join(entryFilePath, 'package.json');
    // 判断是否存在 package.json
    if (!(await pathExists(pkgJsonPath))) {
      throw new Error(`Cannot find package.json. ${pkgJsonPath}`);
    }
    // 读取 package.json
    let pkgJson = await resolvePkgJson(pkgJsonPath);
    model.pkgName = pkgJson.name;
    model.pkgVersion = pkgJson.version;
    if (pkgJson.module) {
      // 支持 es module
      model.sourceType = SourceType.MODULE;
      mainFilePath = pkgJson.module;
    } else if (pkgJson.main) {
      // 支持 commonjs
      model.sourceType = SourceType.MAIN;
      mainFilePath = pkgJson.main;
    } else {
      mainFilePath = './index.js';
    }
    entryFilePath = join(entryFilePath, mainFilePath);
  }

  log('entryFilePath', entryFilePath);
  const entryFileContent = await loadFile(entryFilePath);
  log('entryFile', entryFileContent);
  model.entryFilePath = entryFilePath;
  model.entryFileContent = entryFileContent;
  // 记录入口文件
  log('model', model);
  return model;
}

export async function loadFile(filePath: string): Promise<string> {
  const content: string | Buffer = await readFile(filePath);
  if (typeof content === 'string') {
    return content;
  }
  return content.toString();
}

export async function resolvePkgJson(pkgJsonPath: string): Promise<{ [k: string]: any }> {
  const content = await loadFile(pkgJsonPath);
  const json = JSON.parse(content);
  return json;
}
