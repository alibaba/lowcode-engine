import changeCase from 'change-case';
import {
  FileType,
  BuilderComponentPluginFactory,
  BuilderComponentPlugin,
  ICodeStruct,
  IWithDependency,
  ChunkType,
} from '../../types';

import { COMMON_CHUNK_NAME } from '../../const/generator';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IWithDependency;
    const { chunks } = next;

    if (ir && ir.deps && ir.deps.length > 0) {
      let lowcodeMaterialsStyleAdded = false;
      let fusionUIStyleAdded = false;
      let nextStyleAddedMap: Record<string, boolean> = {};
      ir.deps.forEach((dep: any) => {
        if (dep.package === '@alifd/next' && !nextStyleAddedMap[dep.exportName]) {
          chunks.push({
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: COMMON_CHUNK_NAME.InternalDepsImport,
            content: `import '@alifd/next/lib/${changeCase.paramCase(dep.exportName)}/style';`,
            linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
          });
          nextStyleAddedMap[dep.exportName] = true;
        } else if (dep.package === '@alilc/lowcode-materials' && !lowcodeMaterialsStyleAdded) {
          chunks.push({
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: COMMON_CHUNK_NAME.InternalDepsImport,
            content: 'import \'@alilc/lowcode-materials/lib/style\';',
            linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
          });
          lowcodeMaterialsStyleAdded = true;
        } else if (dep.package === '@alifd/fusion-ui' && !fusionUIStyleAdded) {
          chunks.push({
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: COMMON_CHUNK_NAME.InternalDepsImport,
            content: 'import \'@alifd/fusion-ui/lib/style\';',
            linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
          });
          fusionUIStyleAdded = true;
        }
      });
    }

    return next;
  };

  return plugin;
};

export default pluginFactory;
