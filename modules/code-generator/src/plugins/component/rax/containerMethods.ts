import { CLASS_DEFINE_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';

export interface PluginConfig {
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

    const ir = next.ir as IContainerInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `
         _methods = this._defineMethods();
      `,
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.MethodsBegin,
      content: `
        _defineMethods() {
          return ({
      `,
      linkAfter: [
        RAX_CHUNK_NAME.ClassRenderEnd,
        CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
        RAX_CHUNK_NAME.LifeCyclesEnd,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.MethodsEnd,
      content: `
          });
        }
      `,
      linkAfter: [RAX_CHUNK_NAME.MethodsBegin, RAX_CHUNK_NAME.MethodsContent],
    });

    if (ir.methods && Object.keys(ir.methods).length > 0) {
      Object.entries(ir.methods).forEach(([methodName, methodDefine]) => {
        next.chunks.push({
          type: ChunkType.STRING,
          fileType: cfg.fileType,
          name: RAX_CHUNK_NAME.MethodsContent,
          content: `${methodName}: (${methodDefine.value}),`,
          linkAfter: [RAX_CHUNK_NAME.MethodsBegin],
        });
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
