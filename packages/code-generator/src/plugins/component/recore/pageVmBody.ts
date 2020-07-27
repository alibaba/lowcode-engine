import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  ICodeStruct,
  IContainerInfo,
  IComponentNodeItem,
  INodeGeneratorContext,
  CodePiece,
  PIECE_TYPE,
} from '../../../types';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { createNodeGenerator, generateString } from '../../../utils/nodeToJSX';
import { generateExpression } from '../../../utils/jsExpression';
import { generateCompositeType, handleStringValueDefault } from '../../../utils/compositeType';

const generateGlobalProps = (ctx: INodeGeneratorContext, nodeItem: IComponentNodeItem): CodePiece[] => {
  return [
    {
      value: `{...globalProps.${nodeItem.componentName}}`,
      type: PIECE_TYPE.ATTR,
    },
  ];
};

const generateCtrlLine = (ctx: INodeGeneratorContext, nodeItem: IComponentNodeItem): CodePiece[] => {
  const pieces: CodePiece[] = [];

  if (nodeItem.loop && nodeItem.loopArgs) {
    const loopDataExp = handleStringValueDefault(generateCompositeType(nodeItem.loop));
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
    const conditionExp = handleStringValueDefault(generateCompositeType(nodeItem.condition));
    pieces.push({
      type: PIECE_TYPE.ATTR,
      value: `x-if={${conditionExp}}`,
    });
  }

  return pieces;
};

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const generator = createNodeGenerator(
    {
      string: generateString,
      expression: (input) => [generateExpression(input)],
    },
    [generateGlobalProps, generateCtrlLine],
  );

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
