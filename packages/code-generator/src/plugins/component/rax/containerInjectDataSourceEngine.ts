import { CLASS_DEFINE_CHUNK_NAME, COMMON_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  CompositeValue,
  DataSourceConfig,
  isJSExpression,
  isJSFunction,
} from '../../../types';

import { generateUnknownType } from '../../../utils/compositeType';
import { parseExpressionConvertThis2Context } from '../../../utils/expressionParser';
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
      _dataSourceConfig = this._defineDataSourceConfig();
      _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this._context, { runtimeConfig: true });`,
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

    const dataSourceConfig = isContainerSchema(pre.ir) ? pre.ir.dataSource : null;
    const dataSourceItems: DataSourceConfig[] = (dataSourceConfig && dataSourceConfig.list) || [];

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
      _defineDataSourceConfig() {
        const __$$context = this._context;
        return (${generateUnknownType(
          {
            ...dataSourceConfig,
            list: [
              ...dataSourceItems.map((item) => ({
                ...item,
                isInit: wrapAsFunction(item.isInit),
                options: wrapAsFunction(item.options),
              })),
            ],
          },
          {
            function: (jsFunc) => parseExpressionConvertThis2Context(jsFunc.value, '__$$context'),
            expression: (jsExpr) => parseExpressionConvertThis2Context(jsExpr.value, '__$$context'),
          },
        )});
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
      value: `function(){ return ((${value.value}))}`,
    };
  }

  return {
    type: 'JSExpression',
    value: `function(){return((${generateUnknownType(value)}))}`,
  };
}
