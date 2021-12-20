import { BuilderComponentPlugin, IChunkBuilder, ICodeChunk, ICodeStruct, FileType } from '../types';

import { COMMON_SUB_MODULE_NAME } from '../const/generator';
import { FILE_TYPE_FAMILY } from '../const/file';

interface ChunkGroupInfo {
  chunk: ICodeChunk;
  familyIdx?: number;
}

function whichFamily(type: FileType): [number, FileType[]] | undefined {
  const idx = FILE_TYPE_FAMILY.findIndex((family) => family.indexOf(type) >= 0);
  if (idx < 0) {
    return undefined;
  }
  return [idx, FILE_TYPE_FAMILY[idx]];
}

export const groupChunks = (chunks: ICodeChunk[]): ICodeChunk[][] => {
  const tmp: Record<string, Record<number, number>> = {};
  const col = chunks.reduce((chunksSet: Record<string, ChunkGroupInfo[]>, chunk) => {
    const fileKey = chunk.subModule || COMMON_SUB_MODULE_NAME;
    if (!chunksSet[fileKey]) {
      // eslint-disable-next-line no-param-reassign
      chunksSet[fileKey] = [];
    }
    const res = whichFamily(chunk.fileType as FileType);
    const info: ChunkGroupInfo = {
      chunk,
    };
    if (res) {
      const [familyIdx, family] = res;
      const rank = family.indexOf(chunk.fileType as FileType);
      if (tmp[fileKey]) {
        if (tmp[fileKey][familyIdx] !== undefined) {
          if (tmp[fileKey][familyIdx] > rank) {
            tmp[fileKey][familyIdx] = rank;
          }
        } else {
          tmp[fileKey][familyIdx] = rank;
        }
      } else {
        tmp[fileKey] = {};
        tmp[fileKey][familyIdx] = rank;
      }
      info.familyIdx = familyIdx;
    }

    chunksSet[fileKey].push(info);
    return chunksSet;
  }, {});

  const result: ICodeChunk[][] = [];
  Object.keys(col).forEach((key) => {
    const byType: Record<string, ICodeChunk[]> = {};
    col[key].forEach((info) => {
      let t: string = info.chunk.fileType;
      if (info.familyIdx !== undefined) {
        t = FILE_TYPE_FAMILY[info.familyIdx][tmp[key][info.familyIdx]];
        // eslint-disable-next-line no-param-reassign
        info.chunk.fileType = t;
      }
      if (!byType[t]) {
        byType[t] = [];
      }
      byType[t].push(info.chunk);
    });
    result.push(...Object.keys(byType).map((t) => byType[t]));
  });

  return result;
};

/**
 * 代码片段构建器
 *
 * @export
 * @class ChunkBuilder
 * @template T
 */
export class ChunkBuilder implements IChunkBuilder {
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
      contextData: {},
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

export default ChunkBuilder;
