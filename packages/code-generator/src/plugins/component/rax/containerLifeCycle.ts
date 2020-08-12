import { CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';
import { RAX_CHUNK_NAME } from './const';

import {
  getFuncExprBody,
  transformFuncExpr2MethodMember,
} from '../../../utils/jsExpression';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  CodeGeneratorError,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
  IJSExpression,
} from '../../../types';

type PluginConfig = {
  fileType: string;
  exportNameMapping: Record<string, string>;
  normalizeNameMapping: Record<string, string>;
}

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
      const lifeCycles = ir.lifeCycles;
      const chunks = Object.keys(lifeCycles).map<ICodeChunk>(lifeCycleName => {
        const normalizeName = cfg.normalizeNameMapping[lifeCycleName] || lifeCycleName;
        const exportName = cfg.exportNameMapping[lifeCycleName] || lifeCycleName;
        if (normalizeName === 'constructor') {
          return {
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
            content: getFuncExprBody(
              (lifeCycles[lifeCycleName] as IJSExpression).value,
            ),
            linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]],
          };
        }
        if (normalizeName === 'render') {
          return {
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: RAX_CHUNK_NAME.ClassRenderPre,
            content: getFuncExprBody(
              (lifeCycles[lifeCycleName] as IJSExpression).value,
            ),
            linkAfter: [RAX_CHUNK_NAME.ClassRenderStart],
          };
        }

        return {
          type: ChunkType.STRING,
          fileType: cfg.fileType,
          name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
          content: transformFuncExpr2MethodMember(
            exportName,
            (lifeCycles[lifeCycleName] as IJSExpression).value,
          ),
          linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
        };
      });

      next.chunks.push.apply(next.chunks, chunks);
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
