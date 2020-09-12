import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IParseResult,
} from '../../../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IParseResult;
    const miniAppBuildType = ir.project?.config.miniAppBuildType;

    const buildCfg = {
      inlineStyle: false,
      plugins: [
        [
          'build-plugin-rax-app',
          {
            targets: ['web', 'miniapp'],
            miniapp: miniAppBuildType
              ? {
                buildType: miniAppBuildType,
              }
              : undefined,
          },
        ],
        '@ali/build-plugin-rax-app-def',
      ],
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSON,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: JSON.stringify(buildCfg, null, 2) + '\n',
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
