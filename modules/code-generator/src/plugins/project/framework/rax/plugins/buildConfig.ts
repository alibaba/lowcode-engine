import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IParseResult,
} from '../../../../../types';
import type { RaxFrameworkOptions } from '../types/RaxFrameworkOptions';

const pluginFactory: BuilderComponentPluginFactory<RaxFrameworkOptions> = (cfg) => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IParseResult;

    const miniAppBuildType =
      cfg?.buildConfig?.miniAppBuildType || ir.project?.config?.miniAppBuildType;
    const targets = cfg?.targets || ['web'];

    const buildCfg = {
      inlineStyle: false,
      plugins: [],
      targets,
      miniapp: miniAppBuildType
        ? {
            buildType: miniAppBuildType,
            ...cfg?.buildConfig?.miniapp,
          }
        : cfg?.buildConfig?.miniapp,
      ...cfg?.buildConfig,
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSON,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `${JSON.stringify(buildCfg, null, 2)}\n`,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
