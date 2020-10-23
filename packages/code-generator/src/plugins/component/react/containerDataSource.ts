import { CLASS_DEFINE_CHUNK_NAME } from '../../../const/generator';

import { generateCompositeType } from '../../../utils/compositeType';
import Scope from '../../../utils/Scope';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

type PluginConfig = {
  fileType: string;
};

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

    const scope = Scope.createRootScope();

    if (ir.state) {
      const { state } = ir;
      const fields = Object.keys(state).map<string>((stateName) => {
        const value = generateCompositeType(state[stateName], scope);
        return `${stateName}: ${value},`;
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
        content: `this.state = { ${fields.join('')} };`,
        linkAfter: [CLASS_DEFINE_CHUNK_NAME.ConstructorStart],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
