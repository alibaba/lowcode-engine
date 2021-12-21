import { COMMON_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

export interface PluginConfig {
  fileType: string;
  moduleFileType: string;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.CSS,
    moduleFileType: FileType.JSX,
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css,
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.moduleFileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `import './index.${cfg.fileType}';`,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
