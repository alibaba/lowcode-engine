/* eslint-disable @typescript-eslint/indent */

import {
  IPublicTypeCompositeValue,
  IPublicTypeJSExpression,
  InterpretDataSourceConfig,
  isJSExpression,
  isJSFunction,
} from '@alilc/lowcode-types';
import changeCase from 'change-case';

import { CLASS_DEFINE_CHUNK_NAME, COMMON_CHUNK_NAME } from '../../../const/generator';
import { Scope } from '../../../utils/Scope';

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
import { RaxFrameworkOptions } from '../../project/framework/rax/types/RaxFrameworkOptions';
import { RAX_CHUNK_NAME } from './const';

export interface PluginConfig extends RaxFrameworkOptions {
  fileType?: string;

  /**
   * 数据源的 handlers 的映射配置
   * @deprecated 请使用 datasourceConfig.handlersPackages 来配置
   */
  dataSourceHandlersPackageMap?: Record<string, string>;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    ...config,
    dataSourceHandlersPackageMap:
      config?.dataSourceHandlersPackageMap || config?.datasourceConfig?.handlersPackages,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const scope = Scope.createRootScope();
    const dataSourceConfig = isContainerSchema(pre.ir) ? pre.ir.dataSource : null;
    const dataSourceItems: InterpretDataSourceConfig[] =
      (dataSourceConfig && dataSourceConfig.list) || [];
    const dataSourceEngineOptions = { runtimeConfig: true };
    if (dataSourceItems.length > 0) {
      const requestHandlersMap: Record<string, IPublicTypeJSExpression> = {};

      dataSourceItems.forEach((ds) => {
        const dsType = ds.type || 'fetch';
        if (!(dsType in requestHandlersMap) && dsType !== 'custom') {
          const handlerFactoryName = `__$$create${changeCase.pascal(dsType)}RequestHandler`;

          requestHandlersMap[dsType] = {
            type: 'JSExpression',
            value: `${handlerFactoryName}(${
              dsType === 'urlParams' ? '__$$getSearchParams()' : ''
            })`,
          };

          const handlerFactoryExportName = `create${changeCase.pascal(dsType)}Handler`;
          const handlerPkgName =
            cfg.dataSourceHandlersPackageMap?.[dsType] ||
            `@alilc/lowcode-datasource-${changeCase.kebab(dsType)}-handler`;

          next.chunks.push({
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: COMMON_CHUNK_NAME.ExternalDepsImport,
            content: `
              import { ${handlerFactoryExportName} as ${handlerFactoryName} } from '${handlerPkgName}';
            `,
            linkAfter: [],
          });
        }
      });

      Object.assign(dataSourceEngineOptions, { requestHandlersMap });
    }

    const datasourceEnginePackageName =
      cfg.datasourceConfig?.enginePackage || '@alilc/lowcode-datasource-engine';
    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        import { create as __$$createDataSourceEngine } from '${datasourceEnginePackageName}/runtime';
      `,
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType!,
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
      fileType: cfg.fileType!,
      name: RAX_CHUNK_NAME.ClassDidMountContent,
      content: `
        this._dataSourceEngine.reloadDataSource();
      `,
      linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType!,
      name: CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
      content: `
_defineDataSourceConfig() {
  const __$$context = this._context;
  return (${generateCompositeType(
    {
      ...dataSourceConfig,
      list: [
        ...dataSourceItems.map((item) => ({
          // 数据源引擎默认的 errorHandler 是空的，而且并不会触发组件重新渲染……
          // 这会导致页面状态不能正常展示，故这里处理下:
          errorHandler: {
            type: 'JSFunction',
            value: `function (err){
              setTimeout(() => {
                this.setState({ __refresh: Date.now() + Math.random() });
              }, 0);
              throw err;
            }`,
          },
          ...item,
          isInit:
            typeof item.isInit === 'boolean' || typeof item.isInit === 'undefined'
              ? item.isInit ?? true
              : wrapAsFunction(item.isInit, scope),
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

function wrapAsFunction(value: IPublicTypeCompositeValue, scope: IScope): IPublicTypeCompositeValue {
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
