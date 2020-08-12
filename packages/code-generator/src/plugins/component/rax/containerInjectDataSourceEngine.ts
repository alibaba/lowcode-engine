import { CLASS_DEFINE_CHUNK_NAME, COMMON_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../types';
import { RAX_CHUNK_NAME } from './const';

type PluginConfig = {
  fileType: string;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        import { createDataSourceEngine } from '@ali/lowcode-datasource-engine';
      `,
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `
      _dataSourceList = this._defineDataSourceList();
      _dataSourceEngine = createDataSourceEngine(this._dataSourceList, this._context);`,
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassDidMountContent,
      content: `
        this._dataSourceEngine.reloadDataSource();
      `,
      linkAfter: [
        RAX_CHUNK_NAME.ClassDidMountStart,
      ],
    });

    // TODO: 补充数据源的定义
    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
        _defineDataSourceList() {
          return [];
        }`,
      linkAfter: [
        RAX_CHUNK_NAME.ClassRenderEnd
      ],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
