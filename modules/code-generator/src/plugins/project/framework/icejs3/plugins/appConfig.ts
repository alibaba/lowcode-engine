import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../../../types';
import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

export interface AppConfigPluginConfig {

}

function getContent() {
  return `import { defineAppConfig } from 'ice';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
  // Set your configs here.
  app: {
    rootId: 'App',
  },
  router: {
    type: 'browser',
    basename: '/',
  },
}));`;
}

const pluginFactory: BuilderComponentPluginFactory<AppConfigPluginConfig> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.TS,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: getContent(),
      linkAfter: [],
    });

    return next;
  };

  return plugin;
};

export default pluginFactory;
