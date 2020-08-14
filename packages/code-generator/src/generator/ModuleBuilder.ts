import {
  BuilderComponentPlugin,
  CodeGeneratorError,
  IBasicSchema,
  ICodeChunk,
  ICompiledModule,
  IModuleBuilder,
  IParseResult,
  IResultDir,
  IResultFile,
  ISchemaParser,
  PostProcessor,
} from '../types';

import { COMMON_SUB_MODULE_NAME } from '../const/generator';

import SchemaParser from '../parser/SchemaParser';
import ChunkBuilder from './ChunkBuilder';
import CodeBuilder from './CodeBuilder';

import ResultDir from '../model/ResultDir';
import ResultFile from '../model/ResultFile';

export function createModuleBuilder(
  options: {
    plugins: BuilderComponentPlugin[];
    postProcessors: PostProcessor[];
    mainFileName?: string;
  } = {
    plugins: [],
    postProcessors: [],
  },
): IModuleBuilder {
  const chunkGenerator = new ChunkBuilder(options.plugins);
  const linker = new CodeBuilder();

  const generateModule = async (input: unknown): Promise<ICompiledModule> => {
    const moduleMainName = options.mainFileName || COMMON_SUB_MODULE_NAME;
    if (chunkGenerator.getPlugins().length <= 0) {
      throw new CodeGeneratorError('No plugins found. Component generation cannot work without any plugins!');
    }

    let files: IResultFile[] = [];

    const { chunks } = await chunkGenerator.run(input);
    chunks.forEach((fileChunkList) => {
      const content = linker.link(fileChunkList);
      const file = new ResultFile(fileChunkList[0].subModule || moduleMainName, fileChunkList[0].fileType, content);
      files.push(file);
    });

    if (options.postProcessors.length > 0) {
      files = files.map((file) => {
        let content = file.content;
        const type = file.ext;
        options.postProcessors.forEach((processer) => {
          content = processer(content, type);
        });

        return new ResultFile(file.name, type, content);
      });
    }

    return {
      files,
    };
  };

  const generateModuleCode = async (schema: IBasicSchema | string): Promise<IResultDir> => {
    // Init
    const schemaParser: ISchemaParser = new SchemaParser();
    const parseResult: IParseResult = schemaParser.parse(schema);

    const containerInfo = parseResult.containers[0];
    const { files } = await generateModule(containerInfo);

    const dir = new ResultDir(containerInfo.moduleName);
    files.forEach((file) => dir.addFile(file));

    return dir;
  };

  const linkCodeChunks = (chunks: Record<string, ICodeChunk[]>, fileName: string) => {
    const files: IResultFile[] = [];

    Object.keys(chunks).forEach((fileKey) => {
      const fileChunkList = chunks[fileKey];
      const content = linker.link(fileChunkList);
      const file = new ResultFile(fileChunkList[0].subModule || fileName, fileChunkList[0].fileType, content);
      files.push(file);
    });

    return files;
  };

  return {
    generateModule,
    generateModuleCode,
    linkCodeChunks,
    addPlugin: chunkGenerator.addPlugin.bind(chunkGenerator),
  };
}
