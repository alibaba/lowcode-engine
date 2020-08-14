import { remove } from 'fs-extra';
export { default as validate } from './validate';
export { default as schema } from './validate/schema.json';

export * from './types';

import { IMaterializeOptions } from './types';
import { ComponentMeta } from './otter-core';
import scan from './scan';
import generate from './generate';
import parse from './parse';
import localize from './localize';

export default async function(options: IMaterializeOptions): Promise<ComponentMeta[]> {
  const { accesser = 'local', entry = '' } = options;
  let workDir = entry;
  let moduleDir = '';
  if (accesser === 'online') {
    const result = await localize(options);
    workDir = result.workDir;
    moduleDir = result.moduleDir;
    options.entry = moduleDir;
  }
  const scanedModel = await scan(options);
  const parsedModel = await parse({
    ...scanedModel,
    accesser,
    npmClient: options.npmClient,
    workDir,
    moduleDir,
  });
  const result = await generate(scanedModel, parsedModel);
  if (workDir && accesser === 'online') {
    await remove(workDir);
  }
  return result;
}
