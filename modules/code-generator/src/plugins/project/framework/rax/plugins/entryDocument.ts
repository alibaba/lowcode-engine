import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../../../../types';
import { RaxFrameworkOptions } from '../types/RaxFrameworkOptions';

/**
 * 这种方式已经不推荐使用了
 */
const pluginFactory: BuilderComponentPluginFactory<RaxFrameworkOptions> = (cfg) => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `
import { createElement } from 'rax';
import { Root, Style, Script } from 'rax-document';

function Document() {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"
        />
        <title>${cfg?.title || ir?.meta?.name || 'Rax App'}</title>
        <Style />
      </head>
      <body>
        {/* root container */}
        <Root />
        <Script />
      </body>
    </html>
  );
}

export default Document;
`,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
