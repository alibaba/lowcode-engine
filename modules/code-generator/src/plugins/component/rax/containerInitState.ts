import { CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';

import { generateCompositeType } from '../../../utils/compositeType';
import { Scope } from '../../../utils/Scope';

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
  implementType: 'inConstructor' | 'insMember' | 'hooks';
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    implementType: 'insMember',
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;
    const scope = Scope.createRootScope();

    const state = ir.state || {};
    const fields = Object.keys(state).map<string>((stateName) => {
      // TODO: 这里用什么 handlers?
      const value = generateCompositeType(state[stateName], scope);
      return `${JSON.stringify(stateName)}: ${value}`;
    });

    if (cfg.implementType === 'inConstructor') {
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: `this.state = { ${fields.join(',')} };`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorContent]],
      });
    } else if (cfg.implementType === 'insMember') {
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `state = { ${fields.join(',')} };`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]],
      });
    }
    // TODO: hooks state??

    return next;
  };
  return plugin;
};

export default pluginFactory;
