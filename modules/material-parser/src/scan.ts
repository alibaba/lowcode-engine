import {
  IInternalMaterializeOptions,
  IMaterializeOnlinePackageAndVersionOptions,
  IMaterialScanModel,
} from './types';
import { pathExists, lstatSync } from 'fs-extra';
import { join, isAbsolute, resolve } from 'path';
import { debug } from './core';
import { resolvePkgJson } from './utils';

const log = debug.extend('mat');

export default async function scan(
  options: IInternalMaterializeOptions,
): Promise<IMaterialScanModel> {
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
  if (
    (options.accesser === 'local' ||
      (options.accesser === 'online' &&
        (options as IMaterializeOnlinePackageAndVersionOptions).name &&
        options.entry)) &&
    stats.isFile()
  ) {
    if (options.accesser === 'online') {
      model.useEntry = true;
    }
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
      const moduleFileAbsolutePath = join(options.root, pkgJson.module);
      if (await pathExists(moduleFileAbsolutePath)) {
        model.moduleFilePath = pkgJson.module;
        model.moduleFileAbsolutePath = moduleFileAbsolutePath;
      }
    }
    model.mainFilePath = model.mainFilePath || pkgJson.main || './index.js';
    model.mainFileAbsolutePath = model.mainFileAbsolutePath || resolve(entryFilePath, pkgJson.main);
    const typingsPathCandidates = [
      pkgJson.typings,
      pkgJson.types,
      './index.d.ts',
      './lib/index.d.ts',
    ];
    for (let i = 0; i < typingsPathCandidates.length; i++) {
      const typingsFilePath = typingsPathCandidates[i];
      if (!typingsFilePath) continue;
      const typingsFileAbsolutePath = join(options.root, typingsFilePath);
      if (await pathExists(typingsFileAbsolutePath)) {
        model.typingsFileAbsolutePath = typingsFileAbsolutePath;
        model.typingsFilePath = typingsFilePath;
        break;
      }
    }
  }

  log('model', model);
  return model;
}
