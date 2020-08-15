import { JSExpression, CompositeValue } from '@ali/lowcode-types';

import { CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

import { generateCompositeType } from '../../../utils/compositeType';
import { generateExpression } from '../../../utils/jsExpression';

function packJsExpression(exp: unknown): string {
  const expression = exp as JSExpression;
  const funcStr = generateExpression(expression);
  return `function() { return (${funcStr}); }`;
}

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;
    if (ir.dataSource) {
      const { dataSource } = ir;
      const { list, ...rest } = dataSource;

      let attrs: string[] = [];

      const extConfigs = Object.keys(rest).map((extConfigName) => {
        const value = (rest as Record<string, CompositeValue>)[extConfigName];
        const valueStr = generateCompositeType(value);
        return `${extConfigName}: ${valueStr}`;
      });

      attrs = [...attrs, ...extConfigs];

      const listProp = generateCompositeType((list as unknown) as CompositeValue, {
        handlers: {
          expression: packJsExpression,
        },
      });

      attrs.push(`list: ${listProp}`);

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.TS,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `dataSourceOptions = { ${attrs.join(',\n')} };`,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
