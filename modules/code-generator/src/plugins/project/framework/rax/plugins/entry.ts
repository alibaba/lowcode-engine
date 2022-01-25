import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../../../types';
import { RaxFrameworkOptions } from '../types/RaxFrameworkOptions';

const pluginFactory: BuilderComponentPluginFactory<RaxFrameworkOptions> = (cfg) => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JS,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
import { runApp } from 'rax-app';

import './global.${cfg?.globalStylesFileType || 'css'}';
`,
      linkAfter: [],
    });

    // 应用配置
    const appConfig = cfg?.appConfig || {};
    Object.assign(appConfig, {
      // 路由配置
      router: {
        mode: 'hash',
        ...appConfig.router,
      },
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JS,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: `
runApp(${JSON.stringify(appConfig, null, 2)});
`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
      ],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
