import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../../../../types';

// TODO: How to merge this logic to common deps
const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IProjectInfo;

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JS,
    name: COMMON_CHUNK_NAME.ExternalDepsImport,
    content: `
      import { createApp } from 'ice';
    `,
    linkAfter: [],
  });

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JS,
    name: COMMON_CHUNK_NAME.FileMainContent,
    content: `
      const appConfig = {
        app: {
          rootId: '${ir.config.targetRootID}',
        },
        router: {
          type: '${ir.config.historyMode}',
        },
      };
      createApp(appConfig);
    `,
    linkAfter: [
      COMMON_CHUNK_NAME.ExternalDepsImport,
      COMMON_CHUNK_NAME.InternalDepsImport,
      COMMON_CHUNK_NAME.FileVarDefine,
      COMMON_CHUNK_NAME.FileUtilDefine,
    ],
  });

  return next;
};

export default plugin;
