import { CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  ICodeStruct,
  FileType,
  IContainerInfo,
} from '../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    if (ir.css) {
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.TS,
        name: CLASS_DEFINE_CHUNK_NAME.StaticVar,
        content: `static cssText = '${ir.css.replace(/'/g, '\\\'')}';`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.StaticVar]],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
