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
import { getSlotRelativePath } from '../../../utils/pathHelper';

export interface PluginConfig {
  fileType?: string;

  /** prefer using class property to define utils */
  preferClassProperty?: boolean;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig & { fileType: string } = {
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
      content: `
        import utils${useRef ? ', { RefsManager }' : ''} from '${getSlotRelativePath({ contextData: next.contextData, from: 'components', to: 'utils' })}';
      `,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
    });

    if (cfg.preferClassProperty) {
      // mode: class property
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: 'utils = utils;',
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]],
      });
    } else {
      // mode: assign in constructor
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: 'this.utils = utils;',
        linkAfter: [CLASS_DEFINE_CHUNK_NAME.ConstructorStart],
      });
    }

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
    } else {
      // useRef 为 false 的时候是指没有组件在 props 中配置 ref 属性，但这个时候其实也可能有代码访问 this.$/$$ 所以还是加上个空的代码
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: ' $ = () => null; ',
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: ' $$ = () => [];        ',
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
