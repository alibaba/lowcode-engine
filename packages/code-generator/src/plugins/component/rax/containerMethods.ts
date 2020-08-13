import { CLASS_DEFINE_CHUNK_NAME, COMMON_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';

type PluginConfig = {
  fileType: string;
};

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
          const __$$methods = ({
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

          // 为所有的方法绑定上下文
          Object.entries(__$$methods).forEach(([methodName, method]) => {
            if (typeof method === 'function') {
              __$$methods[methodName] = (...args) => {
                return method.apply(this._context, args);
              }
            }
          });

          return __$$methods;
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
