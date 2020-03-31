import { IMaterializeOptions, IMaterialScanModel, SourceType } from './types';
import { pathExists, readFile } from 'fs-extra';
import { join } from 'path';
import { debug } from './otter-core';
const log = debug.extend('mat');

export default async function scan(
  options: IMaterializeOptions,
): Promise<IMaterialScanModel> {
  const model: IMaterialScanModel = {
    pkgName: '',
    pkgVersion: '',
    mainEntry: '',
    sourceType: SourceType.MODULE,
    modules: [],
  };
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
  let pkgJson = await resolvePkgJson(pkgJsonPath);
  model.pkgName = pkgJson.name;
  model.pkgVersion = pkgJson.version;
  if (isDepsMode) {
    pkgJson = await resolvePkgJson(join(entry, 'package.json'));
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
  const entryFile = await loadFile(entryFilePath);
  log('entryFile', entryFile);
  model.mainEntry = entryFilePath;
  // 记录入口文件
  model.modules.push({
    filePath: entryFilePath,
    fileContent: entryFile,
  });
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

export async function resolvePkgJson(
  pkgJsonPath: string,
): Promise<{ [k: string]: any }> {
  const content = await loadFile(pkgJsonPath);
  const json = JSON.parse(content);
  return json;
}
