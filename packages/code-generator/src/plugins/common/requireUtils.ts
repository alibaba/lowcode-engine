import { COMMON_CHUNK_NAME } from '../../const/generator';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../types';

// TODO: How to merge this logic to common deps
const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: COMMON_CHUNK_NAME.InternalDepsImport,
    content: `import * from 'react';`,
    linkAfter: [],
  });

  return next;
};

export default plugin;
