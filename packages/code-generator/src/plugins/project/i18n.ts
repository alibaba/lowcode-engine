import { COMMON_CHUNK_NAME } from '../../const/generator';

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
    const i18nStr = ir.i18n ? JSON.stringify(ir.i18n, null, 2) : '{}';

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JS,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: `
        import IntlMessageFormat from 'intl-messageformat';

        const i18nConfig = ${i18nStr};

        let locale = 'en-US';

        const getLocale = () => locale;

        const setLocale = (target) => {
          locale = target;
        };

        const i18nFormat = ({ id, defaultMessage }, variables) => {
          const msg = i18nConfig && i18nConfig[locale] && i18nConfig[locale][id] || defaultMessage;
          if (msg == null) {
            console.warn('[i18n]: unknown message id: %o (locale=%o)', id, locale);
            return \`\${id}\`;
          }

          if (!variables || !variables.length) {
            return msg;
          }

          return new IntlMessageFormat(msg, locale).format(variables);
        }

        const i18n = id => {
          return i18nFormat({ id });
        };
      `,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
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
          getLocale,
          setLocale,
          i18n,
          i18nFormat,
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
    return next;
  };
  return plugin;
};

export default pluginFactory;
