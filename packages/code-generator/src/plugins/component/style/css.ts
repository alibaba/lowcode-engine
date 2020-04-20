import { COMMON_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.CSS,
      name: COMMON_CHUNK_NAME.StyleCssContent,
      content: ir.css,
      linkAfter: [COMMON_CHUNK_NAME.StyleDepsImport],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `import './index.css';`,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
