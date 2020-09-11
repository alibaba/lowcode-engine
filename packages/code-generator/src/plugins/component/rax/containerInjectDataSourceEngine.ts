import { CompositeValue, JSExpression, DataSourceConfig, isJSExpression, isJSFunction } from '@ali/lowcode-types';
import changeCase from 'change-case';

import { CLASS_DEFINE_CHUNK_NAME, COMMON_CHUNK_NAME } from '../../../const/generator';
import Scope from '../../../utils/Scope';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IScope,
} from '../../../types';

import { generateCompositeType } from '../../../utils/compositeType';
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

    const scope = Scope.createRootScope();
    const dataSourceConfig = isContainerSchema(pre.ir) ? pre.ir.dataSource : null;
    const dataSourceItems: DataSourceConfig[] = (dataSourceConfig && dataSourceConfig.list) || [];
    const dataSourceEngineOptions = { runtimeConfig: true };
    if (dataSourceItems.length > 0) {
      const requestHandlersMap = {} as Record<string, JSExpression>;

      dataSourceItems.forEach((ds) => {
        if (!(ds.type in requestHandlersMap) && ds.type !== 'custom') {
          const handlerName = '__$$' + changeCase.camelCase(ds.type) + 'RequestHandler';

          requestHandlersMap[ds.type] = {
            type: 'JSExpression',
            value: handlerName + (ds.type === 'urlParams' ? '({ search: this.props.location.search })' : ''),
          };

          next.chunks.push({
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: COMMON_CHUNK_NAME.ExternalDepsImport,
            content: `
              import ${handlerName} from '@ali/lowcode-datasource-engine/handlers/${changeCase.kebabCase(ds.type)}';
            `,
            linkAfter: [],
          });
        }
      });

      Object.assign(dataSourceEngineOptions, { requestHandlersMap });
    }

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
        _dataSourceEngine = __$$createDataSourceEngine(
          this._dataSourceConfig,
          this._context,
          ${generateCompositeType(dataSourceEngineOptions, scope)}
        );`,
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

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
_defineDataSourceConfig() {
  const __$$context = this._context;
  return (${generateCompositeType(
    {
      ...dataSourceConfig,
      list: [
        ...dataSourceItems.map((item) => ({
          ...item,
          isInit: wrapAsFunction(item.isInit, scope),
          options: wrapAsFunction(item.options, scope),
        })),
      ],
    },
    scope,
    {
      handlers: {
        function: (jsFunc) => parseExpressionConvertThis2Context(jsFunc.value, '__$$context'),
        expression: (jsExpr) => parseExpressionConvertThis2Context(jsExpr.value, '__$$context'),
      },
    },
  )});
}
      `,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderEnd],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;

function wrapAsFunction(value: CompositeValue, scope: IScope): CompositeValue {
  if (isJSExpression(value) || isJSFunction(value)) {
    return {
      type: 'JSExpression',
      value: `function(){ return ((${value.value}))}`,
    };
  }

  return {
    type: 'JSExpression',
    value: `function(){return((${generateCompositeType(value, scope)}))}`,
  };
}
