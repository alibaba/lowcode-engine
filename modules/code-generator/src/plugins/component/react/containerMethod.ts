import { CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';

import { generateFunction } from '../../../utils/jsExpression';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';
import { isValidIdentifier } from '../../../utils/validate';

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
    const { inStrictMode } = next.contextData;

    if (!ir.methods) {
      return next;
    }

    // 将这些 methods 都定义到 class 上
    const { methods } = ir;
    const chunks = Object.keys(methods).map<ICodeChunk>((methodName) => ({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
      content: generateFunction(methods[methodName], { name: methodName, isMember: true }),
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
    }));
    next.chunks.push(...chunks);

    // 严格模式下需要将这些方法都挂到上下文中
    if (inStrictMode) {
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: Object.keys(ir.methods)
          .map((methodName) =>
            isValidIdentifier(methodName) ? `.${methodName}` : `[${JSON.stringify(methodName)}]`,
          )
          .map((method) => `this._context${method} = this${method};`)
          .join('\n'),
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
