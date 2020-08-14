import { IMaterializeOptions, IMaterialScanModel } from './types';
import { pathExists, lstatSync } from 'fs-extra';
import { join, isAbsolute, resolve } from 'path';
import { debug } from './otter-core';
import { resolvePkgJson } from './utils';
const log = debug.extend('mat');

export default async function scan(options: IMaterializeOptions): Promise<IMaterialScanModel> {
  const model: IMaterialScanModel = {
    pkgName: '',
    pkgVersion: '',
    mainFileAbsolutePath: '',
    mainFilePath: '',
  };
  log('options', options);
  // 入口文件路径
  let entryFilePath = options.entry;
  const stats = lstatSync(entryFilePath);
  if (!stats.isFile()) {
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
      model.moduleFilePath = pkgJson.module;
      model.moduleFileAbsolutePath = join(entryFilePath, pkgJson.module);
    }
    model.mainFilePath = pkgJson.main || './index.js';
    model.mainFileAbsolutePath = join(entryFilePath, pkgJson.main);
    const typingsFilePath = pkgJson.typings || pkgJson.types || './lib/index.d.ts';

    const typingsFileAbsolutePath = join(entryFilePath, typingsFilePath);
    if (await pathExists(typingsFileAbsolutePath)) {
      model.typingsFileAbsolutePath = typingsFileAbsolutePath;
      model.typingsFilePath = typingsFilePath;
    }
  } else if (isAbsolute(entryFilePath)) {
    model.mainFilePath = entryFilePath;
    model.mainFileAbsolutePath = entryFilePath;
  } else {
    model.mainFilePath = entryFilePath;
    model.mainFileAbsolutePath = resolve(entryFilePath);
  }

  // 记录入口文件
  log('model', model);
  return model;
}
