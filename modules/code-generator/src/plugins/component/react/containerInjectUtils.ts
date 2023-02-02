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
  IProjectTemplate,
} from '../../../types';

export interface PluginConfig {
  fileType: string;

  /** prefer using class property to define utils */
  preferClassProperty?: boolean;
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

    // const isSingleComponent = next.contextData?.projectRemark?.isSingleComponent;
    // const template = next.contextData?.template;

    // function getRelativeUtilsPath(template: IProjectTemplate, isSingleComponent: boolean) {
    //   let relativeUtilsPath = '../../utils';
    //   const utilsPath = template.slots.utils.path;
    //   if (ir.containerType === 'Component') {
    //     // TODO: isSingleComponent
    //     relativeUtilsPath = getRelativePath(template.slots.components.path.join('/'), utilsPath.join('/'));
    //   }
    //   return relativeUtilsPath;
    // }

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
