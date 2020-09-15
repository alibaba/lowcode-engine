import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { BuilderComponentPlugin, BuilderComponentPluginFactory, ChunkType, ICodeStruct } from '../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: 'vx',
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `<div {...globalProps.div} className="recore-loading" x-if={this.__loading} />`,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
