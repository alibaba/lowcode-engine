import 'ts-polyfill';
import { remove, lstatSync } from 'fs-extra';
import { join, isAbsolute } from 'path';
import {
  IMaterializeOptions,
  IMaterializeLocalOptions,
  IMaterializeOnlineOptions,
  IInternalMaterializeOptions,
} from './types';
import { ComponentMeta } from './core';
import scan from './scan';
import generate from './generate';
import parse from './parse';
import localize from './localize';

export { default as validate } from './validate';
export { default as schema } from './validate/schema.json';

export * from './types';

export default async function (options: IMaterializeOptions): Promise<ComponentMeta[]> {
  const { accesser = 'local', dslType } = options;

  let { entry = '' } = options;
  const internalOptions: IInternalMaterializeOptions = {
    ...options,
    accesser,
    entry: options.entry || '',
    root: (options as IMaterializeLocalOptions)?.root || '',
  } as IInternalMaterializeOptions;

  if (accesser === 'local') {
    const { root } = options as IMaterializeLocalOptions;
    internalOptions.root = root;
    if (!root) {
      const stats = lstatSync(entry);
      if (stats.isDirectory()) {
        internalOptions.root = entry;
      } else {
        internalOptions.root = process.cwd();
      }
    } else if (!isAbsolute(entry)) {
      internalOptions.entry = join(root, entry);
    }
  }

  let workDir = internalOptions.root || '';
  let moduleDir = '';
  if (accesser === 'online') {
    const result = await localize(internalOptions as IMaterializeOnlineOptions);
    workDir = result.workDir;
    moduleDir = result.moduleDir;
    internalOptions.entry = result.entry ? join(moduleDir, result.entry) : moduleDir;
    internalOptions.root = moduleDir;
  }
  const scanedModel = await scan(internalOptions);
  const parsedModel = await parse({
    ...scanedModel,
    dslType,
    accesser,
    npmClient: internalOptions.npmClient,
    workDir,
    moduleDir,
  });
  const result = await generate(scanedModel, parsedModel, internalOptions);
  if (workDir && accesser === 'online') {
    await remove(workDir);
  }
  return result;
}
