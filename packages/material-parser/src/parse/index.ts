import parseDynamic from './runtime';
import parseJS from './js';
import parseTS from './ts';
import { install, installPeerDeps, installTypeModules } from '../utils';
import { IMaterialScanModel } from '../types';

export interface IParseArgs extends IMaterialScanModel {
  accesser?: 'online' | 'local';
  npmClient?: string;
  workDir: string;
  moduleDir: string;
  typingsFileAbsolutePath?: string;
  mainFileAbsolutePath: string;
  moduleFileAbsolutePath?: string;
}

export default async (args: IParseArgs) => {
  const { typingsFileAbsolutePath, mainFileAbsolutePath, moduleFileAbsolutePath = mainFileAbsolutePath } = args;
  if (args.accesser === 'local') {
    if (moduleFileAbsolutePath.endsWith('ts') || moduleFileAbsolutePath.endsWith('tsx')) {
      await install(args);
      return parseTS(moduleFileAbsolutePath);
    } else {
      try {
        return parseJS(moduleFileAbsolutePath);
      } catch (e) {
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
    if (typingsFileAbsolutePath) {
      await installTypeModules(args);
      return parseTS(typingsFileAbsolutePath);
    }
    // js
    try {
      // try dynamic parsing first
      await installPeerDeps(args);
      const info = parseDynamic(mainFileAbsolutePath);
      if (!info || !info.length) {
        throw Error();
      }
      return info;
    } catch (e) {
      console.error(e);
      // if error, use static js parsing instead
      return parseJS(moduleFileAbsolutePath);
    }
  }
  return parseJS(moduleFileAbsolutePath);
};
