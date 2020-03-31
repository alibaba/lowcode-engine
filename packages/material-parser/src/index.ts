export { default as validate } from './validate';
export { default as schema } from './validate/schema.json';

export * from './types';

import { IMaterializeOptions } from './types';
import { ComponentMeta } from './otter-core';
import scan from './scan';
import generate from './generate';
import parse from './parse';
import localize from './localize';

export default async function(
  options: IMaterializeOptions,
): Promise<ComponentMeta[]> {
  const { accesser = 'local' } = options;
  if (accesser === 'online') {
    const { entry, cwd } = await localize(options);
    options.entry = entry;
    options.cwd = cwd;
  }
  const scanedModel = await scan(options);
  const parsedModel = await parse(scanedModel.modules[0]);
  const result = await generate(scanedModel, parsedModel);
  return result;
}
