import { CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';
import { REACT_CHUNK_NAME } from './const';

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

type PluginConfig = {
  fileType: string;
  exportNameMapping: Record<string, string>;
  normalizeNameMapping: Record<string, string>;
};

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    exportNameMapping: {},
    normalizeNameMapping: {},
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    if (ir.lifeCycles) {
      const { lifeCycles } = ir;
      const chunks = Object.keys(lifeCycles).map<ICodeChunk>((lifeCycleName) => {
        const normalizeName = cfg.normalizeNameMapping[lifeCycleName] || lifeCycleName;
        const exportName = cfg.exportNameMapping[lifeCycleName] || lifeCycleName;
        if (normalizeName === 'constructor') {
          return {
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]],
          };
        }
        if (normalizeName === 'render') {
          return {
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: REACT_CHUNK_NAME.ClassRenderPre,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [REACT_CHUNK_NAME.ClassRenderStart],
          };
        }

        return {
          type: ChunkType.STRING,
          fileType: cfg.fileType,
          name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
          content: generateFunction(lifeCycles[lifeCycleName], { name: exportName, isMember: true }),
          linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
        };
      });

      next.chunks.push(...chunks);
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
