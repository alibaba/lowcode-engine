import { IMaterializeOptions, IMaterialScanModel } from './types';
import { pathExists, lstatSync } from 'fs-extra';
import { join, isAbsolute, resolve } from 'path';
import { debug } from './core';
import { resolvePkgJson } from './utils';

const log = debug.extend('mat');

export default async function scan(options: IMaterializeOptions & { root: string }): Promise<IMaterialScanModel> {
  const model: IMaterialScanModel = {
    pkgName: '',
    pkgVersion: '',
    mainFileAbsolutePath: '',
    mainFilePath: '',
  };
  log('options', options);
  // 入口文件路径
  const entryFilePath = options.entry;
  const stats = lstatSync(entryFilePath);
  if (options.accesser === 'local' && stats.isFile()) {
    if (isAbsolute(entryFilePath)) {
      model.mainFilePath = entryFilePath;
      model.mainFileAbsolutePath = entryFilePath;
    } else {
      model.mainFilePath = entryFilePath;
      model.mainFileAbsolutePath = resolve(entryFilePath);
    }
  }
  const pkgJsonPath = join(options.root, 'package.json');
  if (await pathExists(pkgJsonPath)) {
    const pkgJson = await resolvePkgJson(pkgJsonPath);
    model.pkgName = pkgJson.name;
    model.pkgVersion = pkgJson.version;
    if (pkgJson.module) {
      model.moduleFilePath = pkgJson.module;
      model.moduleFileAbsolutePath = join(options.root, pkgJson.module);
    }
    model.mainFilePath = model.mainFilePath || pkgJson.main || './index.js';
    model.mainFileAbsolutePath = model.mainFileAbsolutePath || join(entryFilePath, pkgJson.main);
    const typingsFilePath = pkgJson.typings || pkgJson.types || './lib/index.d.ts';
    const typingsFileAbsolutePath = join(entryFilePath, typingsFilePath);
    if (await pathExists(typingsFileAbsolutePath)) {
      model.typingsFileAbsolutePath = typingsFileAbsolutePath;
      model.typingsFilePath = typingsFilePath;
    }
  }

  log('model', model);
  return model;
}
