import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';

import { createReactNodeGenerator } from '../../../utils/nodeToJSX';

type PluginConfig = {
  fileType: string;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    ...config,
  };

  const generator = createReactNodeGenerator();

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;
    const jsxContent = generator(ir);

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassRenderJSX,
      content: `return ${jsxContent};`,
      linkAfter: [
        RAX_CHUNK_NAME.ClassRenderStart,
        RAX_CHUNK_NAME.ClassRenderPre,
      ],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
