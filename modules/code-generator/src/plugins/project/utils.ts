import { COMMON_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IUtilInfo,
} from '../../types';

const pluginFactory: BuilderComponentPluginFactory<string> = (baseFramework?: string) => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const framework = baseFramework || 'react';
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IUtilInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JS,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        import { createRef } from '${framework}';
      `,
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JS,
      name: COMMON_CHUNK_NAME.FileUtilDefine,
      content: `
        export class RefsManager {
          constructor() {
            this.refInsStore = {};
          }

          clearNullRefs() {
            Object.keys(this.refInsStore).forEach((refName) => {
              const filteredInsList = this.refInsStore[refName].filter(insRef => !!insRef.current);
              if (filteredInsList.length > 0) {
                this.refInsStore[refName] = filteredInsList;
              } else {
                delete this.refInsStore[refName];
              }
            });
          }

          get(refName) {
            this.clearNullRefs();
            if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
              return this.refInsStore[refName][0].current;
            }

            return null;
          }

          getAll(refName) {
            this.clearNullRefs();
            if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
              return this.refInsStore[refName].map(i => i.current);
            }

            return [];
          }

          linkRef(refName) {
            const refIns = createRef();
            this.refInsStore[refName] = this.refInsStore[refName] || [];
            this.refInsStore[refName].push(refIns);
            return refIns;
          }
        }
      `,
      linkAfter: [...DEFAULT_LINK_AFTER[COMMON_CHUNK_NAME.FileUtilDefine]],
    });

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
          COMMON_CHUNK_NAME.ImportAliasDefine,
          COMMON_CHUNK_NAME.FileVarDefine,
          COMMON_CHUNK_NAME.FileUtilDefine,
          COMMON_CHUNK_NAME.FileMainContent,
        ],
      });

      ir.utils.forEach((util) => {
        if (util.type === 'function') {
          next.chunks.push({
            type: ChunkType.STRING,
            fileType: FileType.JS,
            name: COMMON_CHUNK_NAME.FileVarDefine,
            content: `
              const ${util.name} = ${util.content.value};
            `,
            linkAfter: [
              COMMON_CHUNK_NAME.ExternalDepsImport,
              COMMON_CHUNK_NAME.InternalDepsImport,
              COMMON_CHUNK_NAME.ImportAliasDefine,
            ],
          });
        }

        next.chunks.push({
          type: ChunkType.STRING,
          fileType: FileType.JS,
          name: COMMON_CHUNK_NAME.FileExport,
          content: `${util.name},`,
          linkAfter: [
            COMMON_CHUNK_NAME.ExternalDepsImport,
            COMMON_CHUNK_NAME.InternalDepsImport,
            COMMON_CHUNK_NAME.ImportAliasDefine,
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
          COMMON_CHUNK_NAME.ImportAliasDefine,
          COMMON_CHUNK_NAME.FileVarDefine,
          COMMON_CHUNK_NAME.FileUtilDefine,
          COMMON_CHUNK_NAME.FileMainContent,
        ],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
