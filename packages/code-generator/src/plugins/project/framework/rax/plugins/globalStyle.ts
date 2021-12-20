import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../../../../types';

export interface GlobalStylePluginConfig {
  fileType: string;
}

const pluginFactory: BuilderComponentPluginFactory<GlobalStylePluginConfig> = (
  config?: Partial<GlobalStylePluginConfig>,
) => {
  const cfg: GlobalStylePluginConfig = {
    fileType: FileType.SCSS,
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.StyleDepsImport,
      content: '',
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
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
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css || '',
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
