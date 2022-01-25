import {
  CLASS_DEFINE_CHUNK_NAME,
  COMMON_CHUNK_NAME,
  DEFAULT_LINK_AFTER,
} from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

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
    next.contextData.useRefApi = true;
    const useRef = !!ir.analyzeResult?.isUsingRef;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      // TODO: 下面这个路径有没有更好的方式来获取？而非写死
      content: `
        import utils${useRef ? ', { RefsManager }' : ''} from '../../utils';
      `,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
      content: 'this.utils = utils;',
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.ConstructorStart],
    });

    if (useRef) {
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: 'this._refsManager = new RefsManager();',
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: `
          $ = (refName) => {
            return this._refsManager.get(refName);
          }
        `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: `
          $$ = (refName) => {
            return this._refsManager.getAll(refName);
          }
        `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
