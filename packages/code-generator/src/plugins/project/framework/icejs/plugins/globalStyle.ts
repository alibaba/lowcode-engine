import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.SCSS,
      name: COMMON_CHUNK_NAME.StyleDepsImport,
      content: `
        // 引入默认全局样式
        @import '@alifd/next/reset.scss';
      `,
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.SCSS,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: `
        body {
          -webkit-font-smoothing: antialiased;
        }
      `,
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.SCSS,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css || '',
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
