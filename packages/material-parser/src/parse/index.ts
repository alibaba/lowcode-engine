import parseDynamic from './dynamic';
import parseJS from './js';
import parseTS from './ts';
import { install, installPeerAndDevDeps, syncTypeModules, installTypeDTS } from '../utils';
import { IMaterialScanModel, DSLType } from '../types';
import { debug } from '../core';

const log = debug.extend('parse');

export interface IParseArgs extends IMaterialScanModel {
  accesser?: 'online' | 'local';
  dslType?: DSLType;
  npmClient?: string;
  workDir: string;
  moduleDir: string;
  typingsFileAbsolutePath?: string;
  mainFileAbsolutePath: string;
  moduleFileAbsolutePath?: string;
}

export function isTSLike(str) {
  return str.endsWith('ts') || str.endsWith('tsx');
}

export default async (args: IParseArgs) => {
  const {
    typingsFileAbsolutePath,
    mainFileAbsolutePath,
    moduleFileAbsolutePath = mainFileAbsolutePath,
    useEntry = false,
  } = args;
  if (args.accesser === 'local') {
    if (isTSLike(mainFileAbsolutePath)) {
      await install(args);
      // in case the developer forgets to install types
      await installTypeDTS(args);
      return parseTS(mainFileAbsolutePath, args);
    } else if (typingsFileAbsolutePath) {
      await installTypeDTS(args);
      return parseTS(typingsFileAbsolutePath, args);
    } else {
      try {
        return parseJS(moduleFileAbsolutePath || mainFileAbsolutePath);
      } catch (e) {
        log(e);
        await install(args);
        const info = parseDynamic(mainFileAbsolutePath);
        if (!info || !info.length) {
          throw Error();
        }
        return info;
      }
    }
  } else if (args.accesser === 'online') {
    // ts
    const entryPath = useEntry ? mainFileAbsolutePath : typingsFileAbsolutePath;
    if (entryPath && isTSLike(entryPath)) {
      await syncTypeModules(args);
      await install(args);
      await installTypeDTS(args);
      await installPeerAndDevDeps(args);
      return parseTS(entryPath, args);
    }
    // js
    try {
      // try dynamic parsing first
      await installPeerAndDevDeps(args);
      const info = parseDynamic(mainFileAbsolutePath);
      if (!info || !info.length) {
        throw Error();
      }
      return info;
    } catch (e) {
      log(e);
      // if error, use static js parsing instead
      return parseJS(moduleFileAbsolutePath || mainFileAbsolutePath);
    }
  }
  return parseJS(moduleFileAbsolutePath || mainFileAbsolutePath);
};
