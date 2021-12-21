import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
  IScope,
  NodeGeneratorConfig,
  PIECE_TYPE,
} from '../../../types';

import { REACT_CHUNK_NAME } from './const';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { createReactNodeGenerator } from '../../../utils/nodeToJSX';
import Scope from '../../../utils/Scope';

export interface PluginConfig {
  fileType?: string;
  nodeTypeMapping?: Record<string, string>;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg = {
    fileType: FileType.JSX,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    nodeTypeMapping: {} as Record<string, string>,
    ...config,
  };

  const { nodeTypeMapping } = cfg;

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const generatorPlugins: NodeGeneratorConfig = {
      tagMapping: (v) => nodeTypeMapping[v] || v,
    };

    if (next.contextData.useRefApi) {
      generatorPlugins.attrPlugins = [
        (attrData, scope, pluginCfg, nextFunc) => {
          if (attrData.attrName === 'ref') {
            return [
              {
                name: attrData.attrName,
                value: `this._refsManager.linkRef('${attrData.attrValue}')`,
                type: PIECE_TYPE.ATTR,
              },
            ];
          }

          return nextFunc ? nextFunc(attrData, scope, pluginCfg) : [];
        },
      ];
    }

    const generator = createReactNodeGenerator(generatorPlugins);

    const ir = next.ir as IContainerInfo;
    const scope: IScope = Scope.createRootScope();
    const jsxContent = generator(ir, scope);

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: REACT_CHUNK_NAME.ClassRenderJSX,
      content: `
        const __$$context = this;
        return ${jsxContent};
      `,
      linkAfter: [REACT_CHUNK_NAME.ClassRenderStart, REACT_CHUNK_NAME.ClassRenderPre],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `
        function __$$createChildContext(oldContext, ext) {
          return Object.assign({}, oldContext, ext);
        }

      `,
      linkAfter: [COMMON_CHUNK_NAME.FileExport],
    });
    return next;
  };
  return plugin;
};

export default pluginFactory;
