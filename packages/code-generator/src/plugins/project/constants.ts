import { COMMON_CHUNK_NAME } from '../../const/generator';
import { generateCompositeType } from '../../utils/compositeType';
import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;
    if (ir.constants) {
      const constantStr = generateCompositeType(ir.constants);

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.JS,
        name: COMMON_CHUNK_NAME.FileVarDefine,
        content: `
          const constantConfig = ${constantStr};
        `,
        linkAfter: [
          COMMON_CHUNK_NAME.ExternalDepsImport,
          COMMON_CHUNK_NAME.InternalDepsImport,
          COMMON_CHUNK_NAME.ImportAliasDefine,
        ],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.JS,
        name: COMMON_CHUNK_NAME.FileExport,
        content: `
          export default constantConfig;
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
