import { COMMON_CHUNK_NAME } from '../../const/generator';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
  IUtilInfo,
} from '../../types';

// TODO: How to merge this logic to common deps
const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IUtilInfo;

  if (ir.utils) {
    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JS,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `
        export default {
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
        COMMON_CHUNK_NAME.FileMainContent,
      ],
    });

    ir.utils.forEach(util => {
      if (util.type === 'function') {
        next.chunks.push({
          type: ChunkType.STRING,
          fileType: FileType.JS,
          name: COMMON_CHUNK_NAME.FileVarDefine,
          content: `
            const ${util.name} = ${util.content};
          `,
          linkAfter: [
            COMMON_CHUNK_NAME.ExternalDepsImport,
            COMMON_CHUNK_NAME.InternalDepsImport,
          ],
        });
      }

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.JS,
        name: COMMON_CHUNK_NAME.FileExport,
        content: `
          ${util.name},
        `,
        linkAfter: [
          COMMON_CHUNK_NAME.ExternalDepsImport,
          COMMON_CHUNK_NAME.InternalDepsImport,
          COMMON_CHUNK_NAME.FileVarDefine,
          COMMON_CHUNK_NAME.FileUtilDefine,
          COMMON_CHUNK_NAME.FileMainContent,
        ],
      });
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JS,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `
        };
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
        COMMON_CHUNK_NAME.FileMainContent,
      ],
    });
  }

  return next;
};

export default plugin;
