import { CLASS_DEFINE_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../types';
import { RAX_CHUNK_NAME } from './const';

type PluginConfig = {
  fileType: string;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    // TODO: utils 怎么注入？
    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `_utils = this._defineUtils();`,
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start],
    });


    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
        _defineUtils() {
          return {};
        }`,
      linkAfter: [
        RAX_CHUNK_NAME.ClassRenderEnd
      ],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
