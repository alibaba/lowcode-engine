import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../../../types';
import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: `
      import { Outlet } from 'ice';
      import BasicLayout from '@/layouts/BasicLayout';

      export default function Layout() {
        return (
          <BasicLayout>
            <Outlet />
          </BasicLayout>
        );;
      }
      `,
      linkAfter: [],
    });

    return next;
  };

  return plugin;
};

export default pluginFactory;
