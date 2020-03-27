import {
  BuilderComponentPlugin,
  CodeGeneratorError,
  ICodeChunk,
  ICompiledModule,
  IModuleBuilder,
  IResultFile,
} from '../types';

import { COMMON_SUB_MODULE_NAME } from '../const/generator';

import ChunkBuilder from './ChunkBuilder';
import CodeBuilder from './CodeBuilder';

import ResultFile from '../model/ResultFile';

export function createModuleBuilder(
  options: {
    plugins: BuilderComponentPlugin[];
    mainFileName?: string;
  } = {
    plugins: [],
  },
): IModuleBuilder {
  const chunkGenerator = new ChunkBuilder(options.plugins);
  const linker = new CodeBuilder();

  const generateModule = async (input: unknown): Promise<ICompiledModule> => {
    const moduleMainName = options.mainFileName || COMMON_SUB_MODULE_NAME;
    if (chunkGenerator.getPlugins().length <= 0) {
      throw new CodeGeneratorError(
        'No plugins found. Component generation cannot work without any plugins!',
      );
    }

    const files: IResultFile[] = [];

    const { chunks } = await chunkGenerator.run(input);
    chunks.forEach(fileChunkList => {
      const content = linker.link(fileChunkList);
      const file = new ResultFile(
        fileChunkList[0].subModule || moduleMainName,
        fileChunkList[0].fileType,
        content,
      );
      files.push(file);
    });

    return {
      files,
    };
  };

  const linkCodeChunks = (
    chunks: Record<string, ICodeChunk[]>,
    fileName: string,
  ) => {
    const files: IResultFile[] = [];

    Object.keys(chunks).forEach(fileKey => {
      const fileChunkList = chunks[fileKey];
      const content = linker.link(fileChunkList);
      const file = new ResultFile(
        fileChunkList[0].subModule || fileName,
        fileChunkList[0].fileType,
        content,
      );
      files.push(file);
    });

    return files;
  };

  return {
    generateModule,
    linkCodeChunks,
    addPlugin: chunkGenerator.addPlugin.bind(chunkGenerator),
  };
}
