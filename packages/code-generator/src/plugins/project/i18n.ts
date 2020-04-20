import { COMMON_CHUNK_NAME } from '../../const/generator';
import { generateCompositeType } from '../../plugins/utils/compositeType';
import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../types';

// TODO: How to merge this logic to common deps
const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;
    if (ir.i18n) {
      const [, i18nStr] = generateCompositeType(ir.i18n);

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.JS,
        name: COMMON_CHUNK_NAME.FileMainContent,
        content: `
          const i18nConfig = ${i18nStr};
          let locale = 'en_US';

          const changeLocale = (target) => {
            locale = target;
          };

          const i18n = key => i18nConfig && i18nConfig[locale] && i18nConfig[locale][key] || '';
        `,
        linkAfter: [
          COMMON_CHUNK_NAME.ExternalDepsImport,
          COMMON_CHUNK_NAME.InternalDepsImport,
          COMMON_CHUNK_NAME.FileVarDefine,
          COMMON_CHUNK_NAME.FileUtilDefine,
        ],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.JS,
        name: COMMON_CHUNK_NAME.FileExport,
        content: `
          export {
            changeLocale,
            i18n,
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
  return plugin;
};

export default pluginFactory;
