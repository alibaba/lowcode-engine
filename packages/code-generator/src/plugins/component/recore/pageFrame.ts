import { COMMON_CHUNK_NAME, CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';

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
      fileType: FileType.TS,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `import { BaseController } from '@ali/recore-renderer';`,
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.TS,
      name: CLASS_DEFINE_CHUNK_NAME.Start,
      content: `class ${ir.moduleName} extends BaseController {`,
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.Start]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.TS,
      name: CLASS_DEFINE_CHUNK_NAME.End,
      content: `}`,
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.End]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.TS,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
      content: 'init() {',
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.TS,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
      content: '}',
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorEnd]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.TS,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: 'globalProps = (window as any)?.g_config?.globalProps || {};',
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.TS,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `export default ${ir.moduleName};`,
      linkAfter: [...DEFAULT_LINK_AFTER[COMMON_CHUNK_NAME.FileExport]],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
