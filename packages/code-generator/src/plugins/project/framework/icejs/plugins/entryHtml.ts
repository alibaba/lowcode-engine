import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.HTML,
      name: COMMON_CHUNK_NAME.HtmlContent,
      content: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1" />
            <meta name="viewport" content="width=device-width" />
            <title>${ir?.meta?.name || 'Ice App'}</title>
          </head>
          <body>
            <div id="app"></div>
          </body>
        </html>
      `,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
