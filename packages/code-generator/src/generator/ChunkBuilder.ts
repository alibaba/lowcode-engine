import { BuilderComponentPlugin, IChunkBuilder, ICodeChunk, ICodeStruct } from '../types';

import { COMMON_SUB_MODULE_NAME } from '../const/generator';

export const groupChunks = (chunks: ICodeChunk[]): ICodeChunk[][] => {
  const col = chunks.reduce((chunksSet: Record<string, ICodeChunk[]>, chunk) => {
    const fileKey = `${chunk.subModule || COMMON_SUB_MODULE_NAME}.${chunk.fileType}`;
    if (!chunksSet[fileKey]) {
      chunksSet[fileKey] = [];
    }
    chunksSet[fileKey].push(chunk);
    return chunksSet;
  }, {});

  return Object.keys(col).map((key) => col[key]);
};

/**
 * 代码片段构建器
 *
 * @export
 * @class ChunkBuilder
 * @template T
 */
export default class ChunkBuilder implements IChunkBuilder {
  private plugins: BuilderComponentPlugin[];

  constructor(plugins: BuilderComponentPlugin[] = []) {
    this.plugins = plugins;
  }

  async run(
    ir: unknown,
    initialStructure: ICodeStruct = {
      ir,
      chunks: [],
      depNames: [],
    },
  ) {
    const structure = initialStructure;

    const finalStructure: ICodeStruct = await this.plugins.reduce(
      async (previousPluginOperation: Promise<ICodeStruct>, plugin) => {
        const modifiedStructure = await previousPluginOperation;
        return plugin(modifiedStructure);
      },
      Promise.resolve(structure),
    );

    const chunks = groupChunks(finalStructure.chunks);

    return {
      chunks,
    };
  }

  getPlugins() {
    return this.plugins;
  }

  addPlugin(plugin: BuilderComponentPlugin) {
    this.plugins.push(plugin);
  }
}
