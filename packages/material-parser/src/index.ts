import { remove, lstatSync } from 'fs-extra';
export { default as validate } from './validate';
export { default as schema } from './validate/schema.json';

export * from './types';

import { IMaterializeOptions } from './types';
import { ComponentMeta } from './core';
import scan from './scan';
import generate from './generate';
import parse from './parse';
import localize from './localize';

export default async function (options: IMaterializeOptions): Promise<ComponentMeta[]> {
  const { accesser = 'local', entry = '' } = options;
  let { root } = options;
  if (!root && accesser === 'local') {
    const stats = lstatSync(entry);
    if (stats.isDirectory()) {
      root = entry;
    } else {
      root = process.cwd();
    }
  }

  const internalOptions = {
    ...options,
    root,
  };

  let workDir = root || '';
  let moduleDir = '';
  if (accesser === 'online') {
    const result = await localize(internalOptions);
    workDir = result.workDir;
    moduleDir = result.moduleDir;
    internalOptions.entry = moduleDir;
    internalOptions.root = moduleDir;
  }
  const scanedModel = await scan(internalOptions as IMaterializeOptions & { root: string });
  const parsedModel = await parse({
    ...scanedModel,
    accesser,
    npmClient: internalOptions.npmClient,
    workDir,
    moduleDir,
  });
  const result = await generate(scanedModel, parsedModel);
  if (workDir && accesser === 'online') {
    await remove(workDir);
  }
  return result;
}
