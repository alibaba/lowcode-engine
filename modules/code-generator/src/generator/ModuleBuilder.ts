import { IPublicTypeProjectSchema, ResultFile, ResultDir } from '@alilc/lowcode-types';

import {
  BuilderComponentPlugin,
  CodeGeneratorError,
  ICodeChunk,
  ICompiledModule,
  IContextData,
  IModuleBuilder,
  IParseResult,
  ISchemaParser,
  PostProcessor,
} from '../types';

import { COMMON_SUB_MODULE_NAME } from '../const/generator';

import { SchemaParser } from '../parser/SchemaParser';
import { ChunkBuilder } from './ChunkBuilder';
import { CodeBuilder } from './CodeBuilder';
import { createResultFile, createResultDir, addFile } from '../utils/resultHelper';

export function createModuleBuilder(
  options: {
    plugins: BuilderComponentPlugin[];
    postProcessors: PostProcessor[];
    mainFileName?: string;
    contextData?: IContextData;
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
      throw new CodeGeneratorError(
        'No plugins found. Component generation cannot work without any plugins!',
      );
    }

    let files: ResultFile[] = [];

    const { chunks } = await chunkGenerator.run(input, {
      ir: input,
      chunks: [],
      depNames: [],
      contextData: options.contextData || {},
    });

    chunks.forEach((fileChunkList) => {
      const content = linker.link(fileChunkList);
      const file = createResultFile(
        fileChunkList[0].subModule || moduleMainName,
        fileChunkList[0].fileType,
        content,
      );
      files.push(file);
    });

    if (options.postProcessors.length > 0) {
      files = files.map((file) => {
        let { content, ext: type, name } = file;
        options.postProcessors.forEach((processer) => {
          content = processer(content, type, name);
        });

        return createResultFile(file.name, type, content);
      });
    }

    return {
      files,
    };
  };

  const generateModuleCode = async (schema: IPublicTypeProjectSchema | string): Promise<ResultDir> => {
    // Init
    const schemaParser: ISchemaParser = new SchemaParser();
    const parseResult: IParseResult = schemaParser.parse(schema);

    const containerInfo = parseResult.containers[0];
    const { files } = await generateModule(containerInfo);

    const dir = createResultDir(containerInfo.moduleName);
    files.forEach((file) => addFile(dir, file));

    return dir;
  };

  const linkCodeChunks = (chunks: Record<string, ICodeChunk[]>, fileName: string) => {
    const files: ResultFile[] = [];

    Object.keys(chunks).forEach((fileKey) => {
      const fileChunkList = chunks[fileKey];
      const content = linker.link(fileChunkList);
      const file = createResultFile(
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
    generateModuleCode,
    linkCodeChunks,
    addPlugin: chunkGenerator.addPlugin.bind(chunkGenerator),
  };
}
