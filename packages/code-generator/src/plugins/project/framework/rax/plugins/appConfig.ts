import changeCase from 'change-case';
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

    const routes = ir.globalRouter?.routes?.map((route) => ({
      path: route.path,
      source: `pages/${changeCase.pascalCase(route.fileName)}/index`,
    })) || [{ path: '/', source: 'pages/Home/index' }];

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSON,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `
{
  "routes": ${JSON.stringify(routes, null, 2)},
  "window": {
    "title": ${JSON.stringify(ir.project?.meta?.title || ir.project?.meta?.name || '')}
  }
}
      `,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
