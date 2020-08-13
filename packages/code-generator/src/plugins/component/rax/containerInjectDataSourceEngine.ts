import { CompositeValue, DataSourceConfig, isJSExpression, isJSFunction } from '@ali/lowcode-types';

import { CLASS_DEFINE_CHUNK_NAME, COMMON_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../types';
import { generateUnknownType } from '../../../utils/compositeType';
import { isContainerSchema } from '../../../utils/schema';
import { RAX_CHUNK_NAME } from './const';

type PluginConfig = {
  fileType: string;
};

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
        import { create as __$$createDataSourceEngine } from '@ali/lowcode-datasource-engine';
      `,
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsVar,
      content: `
      _dataSourceList = this._defineDataSourceList();
      _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceList, this._context);`,
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassDidMountContent,
      content: `
        this._dataSourceEngine.reloadDataSource();
      `,
      linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin],
    });

    const dataSource = isContainerSchema(pre.ir) ? pre.ir.dataSource : null;
    const dataSourceItems: DataSourceConfig[] = (dataSource && dataSource.list) || [];

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      // TODO: 下面的定义应该需要调用 @ali/lowcode-datasource-engine 的方法来搞:
      content: `
        _defineDataSourceList() {
          return (function(){
            return (${generateUnknownType([
              ...dataSourceItems.map((item) => ({
                ...item,
                isInit: wrapAsFunction(item.isInit),
                options: wrapAsFunction(item.options),
              })),
            ])});
          }).call(this._context);
        }`,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderEnd],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;

function wrapAsFunction(value: CompositeValue): CompositeValue {
  if (isJSExpression(value) || isJSFunction(value)) {
    return {
      type: 'JSExpression',
      value: `() => (${value.value})`,
    };
  }

  return {
    type: 'JSExpression',
    value: `() => (${generateUnknownType(value)})`,
  };
}
