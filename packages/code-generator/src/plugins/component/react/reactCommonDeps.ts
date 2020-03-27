import { COMMON_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

// TODO: How to merge this logic to common deps
const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: COMMON_CHUNK_NAME.ExternalDepsImport,
    content: `import React from 'react';`,
    linkAfter: [],
  });

  return next;
};

export default plugin;
