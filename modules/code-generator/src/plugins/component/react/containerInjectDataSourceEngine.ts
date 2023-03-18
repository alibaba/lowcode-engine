/* eslint-disable @typescript-eslint/indent */

import {
  IPublicTypeCompositeValue,
  IPublicTypeJSExpression,
  InterpretDataSourceConfig,
  isJSExpression,
  isJSFunction,
} from '@alilc/lowcode-types';
import changeCase from 'change-case';

import {
  CLASS_DEFINE_CHUNK_NAME,
  COMMON_CHUNK_NAME,
  DEFAULT_LINK_AFTER,
} from '../../../const/generator';
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
import { isValidContainerType } from '../../../utils/schema';
import { REACT_CHUNK_NAME } from './const';
import { isJSExpressionFn } from '../../../utils/common';

export interface PluginConfig {
  fileType?: string;

  /**
   * 数据源配置
   */
  datasourceConfig?: {

    /** 数据源引擎的版本 */
    engineVersion?: string;

    /** 数据源引擎的包名 */
    enginePackage?: string;

    /** 数据源 handlers 的版本 */
    handlersVersion?: {
      [key: string]: string;
    };

    /** 数据源 handlers 的包名 */
    handlersPackages?: {
      [key: string]: string;
    };
  };
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg = {
    ...config,
    fileType: config?.fileType || FileType.JSX,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const scope = Scope.createRootScope();
    const dataSourceConfig = isValidContainerType(pre.ir) ? pre.ir.dataSource : null;
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
            value:
              handlerFactoryName + (dsType === 'urlParams' ? '(window.location.search)' : '()'),
          };

          const handlerFactoryExportName = `create${changeCase.pascal(dsType)}Handler`;
          const handlerPkgName =
            cfg.datasourceConfig?.handlersPackages?.[dsType] ||
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

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.JSX,
        name: COMMON_CHUNK_NAME.ExternalDepsImport,
        content: `
          import { create as __$$createDataSourceEngine } from '@alilc/lowcode-datasource-engine/runtime';
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
            this,
            ${generateCompositeType(dataSourceEngineOptions, scope)}
          );

          get dataSourceMap() {
            return this._dataSourceEngine.dataSourceMap || {};
          }

          reloadDataSource = async () => {
            await this._dataSourceEngine.reloadDataSource();
          }

          `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsVar]],
      });

      next.chunks.unshift({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: REACT_CHUNK_NAME.ClassDidMountContent,
        content: `
          this._dataSourceEngine.reloadDataSource();
        `,
        linkAfter: [REACT_CHUNK_NAME.ClassDidMountStart],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
        content: `
  _defineDataSourceConfig() {
    const _this = this;
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
          function: (jsFunc) => parseExpressionConvertThis2Context(jsFunc.value, '_this'),
          expression: (jsExpr) => parseExpressionConvertThis2Context(jsExpr.value, '_this'),
        },
      },
    )});
  }
        `,
        linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;

function wrapAsFunction(value: IPublicTypeCompositeValue, scope: IScope): IPublicTypeCompositeValue {
  if (isJSExpression(value) || isJSFunction(value) || isJSExpressionFn(value)) {
    return {
      type: 'JSExpression',
      value: `function(){ return ((${value.value}))}.bind(this)`,
    };
  }

  return {
    type: 'JSExpression',
    value: `function(){return((${generateCompositeType(value, scope)}))}.bind(this)`,
  };
}
