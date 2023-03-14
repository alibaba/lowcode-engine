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
} from '../../../types';
import { getSlotRelativePath } from '../../../utils/pathHelper';

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

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.InternalDepsImport,
      content: `
        import * as __$$i18n from '${getSlotRelativePath({ contextData: next.contextData, from: 'components', to: 'i18n' })}';
      `,
      linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
      content: `
        __$$i18n._inject2(this);
      `,
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
