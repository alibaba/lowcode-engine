import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
  IScope,
} from '../../../types';

import { REACT_CHUNK_NAME } from './const';

import { createReactNodeGenerator } from '../../../utils/nodeToJSX';
import Scope from '../../../utils/Scope';

type PluginConfig = {
  fileType?: string;
  nodeTypeMapping?: Record<string, string>;
};

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg = {
    fileType: FileType.JSX,
    nodeTypeMapping: {},
    ...config,
  };

  const { nodeTypeMapping } = cfg;

  const generator = createReactNodeGenerator({
    tagMapping: (v) => nodeTypeMapping[v] || v,
  });

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;
    const scope: IScope = Scope.createRootScope();
    const jsxContent = generator(ir, scope);

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: REACT_CHUNK_NAME.ClassRenderJSX,
      content: `return ${jsxContent};`,
      linkAfter: [REACT_CHUNK_NAME.ClassRenderStart, REACT_CHUNK_NAME.ClassRenderPre],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
