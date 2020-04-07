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
  const { accesser = 'local' } = options;
  if (accesser === 'online') {
    const entry = await localize(options);
    options.entry = entry;
  }
  const scanedModel = await scan(options);
  const parsedModel = await parse({
    filePath: scanedModel.entryFilePath,
    fileContent: scanedModel.entryFileContent,
  });
  const result = await generate(scanedModel, parsedModel);
  return result;
}
