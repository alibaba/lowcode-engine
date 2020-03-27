import { COMMON_CHUNK_NAME } from '@/const/generator';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
  IRouterInfo,
} from '@/types';

// TODO: How to merge this logic to common deps
const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IRouterInfo;

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JS,
    name: COMMON_CHUNK_NAME.InternalDepsImport,
    content: `
      import BasicLayout from '@/layouts/BasicLayout';
    `,
    linkAfter: [COMMON_CHUNK_NAME.ExternalDepsImport],
  });

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JS,
    name: COMMON_CHUNK_NAME.FileVarDefine,
    content: `
      const routerConfig = [
        {
          path: '/',
          component: BasicLayout,
          children: [
            ${ir.routes
              .map(
                route => `
                  {
                    path: '${route.path}',
                    component: ${route.componentName},
                  }
                `,
              )
              .join(',')}
          ],
        },
      ];
    `,
    linkAfter: [
      COMMON_CHUNK_NAME.ExternalDepsImport,
      COMMON_CHUNK_NAME.InternalDepsImport,
      COMMON_CHUNK_NAME.FileUtilDefine,
    ],
  });

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JS,
    name: COMMON_CHUNK_NAME.FileExport,
    content: `
      export default routerConfig;
    `,
    linkAfter: [
      COMMON_CHUNK_NAME.ExternalDepsImport,
      COMMON_CHUNK_NAME.InternalDepsImport,
      COMMON_CHUNK_NAME.FileUtilDefine,
      COMMON_CHUNK_NAME.FileVarDefine,
      COMMON_CHUNK_NAME.FileMainContent,
    ],
  });

  return next;
};

export default plugin;
