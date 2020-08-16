import { NodeSchema } from '@ali/lowcode-types';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  ICodeStruct,
  IContainerInfo,
  INodeGeneratorContext,
  CodePiece,
  PIECE_TYPE,
} from '../../../types';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { createNodeGenerator } from '../../../utils/nodeToJSX';
import { generateCompositeType } from '../../../utils/compositeType';

const generateGlobalProps = (ctx: INodeGeneratorContext, nodeItem: NodeSchema): CodePiece[] => {
  return [
    {
      value: `{...globalProps.${nodeItem.componentName}}`,
      type: PIECE_TYPE.ATTR,
    },
  ];
};

const generateCtrlLine = (ctx: INodeGeneratorContext, nodeItem: NodeSchema): CodePiece[] => {
  const pieces: CodePiece[] = [];

  if (nodeItem.loop && nodeItem.loopArgs) {
    const loopDataExp = generateCompositeType(nodeItem.loop);
    pieces.push({
      type: PIECE_TYPE.ATTR,
      value: `x-for={${loopDataExp}}`,
    });

    pieces.push({
      type: PIECE_TYPE.ATTR,
      value: `x-each="${nodeItem.loopArgs[0]},${nodeItem.loopArgs[1]}"`,
    });
  }

  if (nodeItem.condition) {
    const conditionExp = generateCompositeType(nodeItem.condition);
    pieces.push({
      type: PIECE_TYPE.ATTR,
      value: `x-if={${conditionExp}}`,
    });
  }

  return pieces;
};

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const generator = createNodeGenerator({
    plugins: [generateGlobalProps, generateCtrlLine],
  });

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    const vxContent = generator(ir);

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: 'vx',
      name: COMMON_CHUNK_NAME.CustomContent,
      content: vxContent,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
