import _ from 'lodash';
import { isJSExpression, isJSFunction } from '@alilc/lowcode-types';

import { CLASS_DEFINE_CHUNK_NAME } from '../../../const/generator';
import { RAX_CHUNK_NAME } from './const';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  FileType,
  ChunkType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';
import { debug } from '../../../utils/debug';
import { isJSExpressionFn } from '../../../utils/common';

export interface PluginConfig {
  fileType: string;
  exportNameMapping: Record<string, string>;
  normalizeNameMapping: Record<string, string>;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    exportNameMapping: {},
    normalizeNameMapping: {
      didMount: 'componentDidMount',
      willUnmount: 'componentWillUnmount',
    },
    ...config,
  };

  const exportNameMapping = new Map(Object.entries(cfg.exportNameMapping));
  const normalizeNameMapping = new Map(Object.entries(cfg.normalizeNameMapping));

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    // Rax 先只支持 didMount 和 willUnmount 吧

    const ir = next.ir as IContainerInfo;
    const { lifeCycles } = ir;

    if (lifeCycles && !_.isEmpty(lifeCycles)) {
      Object.entries(lifeCycles).forEach(([lifeCycleName, lifeCycleMethodExpr]) => {
        // 过滤掉非法数据（有些场景下会误传入空字符串或 null)
        if (
          !isJSFunction(lifeCycles[lifeCycleName]) &&
          !isJSExpressionFn(lifeCycles[lifeCycleName]) &&
          !isJSExpression(lifeCycles[lifeCycleName])
        ) {
          return;
        }

        const normalizeName = normalizeNameMapping.get(lifeCycleName) || lifeCycleName;
        const exportName = exportNameMapping.get(lifeCycleName) || lifeCycleName;

        next.chunks.push({
          type: ChunkType.STRING,
          fileType: cfg.fileType,
          name: RAX_CHUNK_NAME.LifeCyclesContent,
          content: `${exportName}: (${lifeCycleMethodExpr.value}),`,
          linkAfter: [RAX_CHUNK_NAME.LifeCyclesBegin],
        });

        if (normalizeName === 'constructor') {
          next.chunks.push({
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [CLASS_DEFINE_CHUNK_NAME.ConstructorStart],
          });
        } else if (normalizeName === 'componentDidMount') {
          next.chunks.push({
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: RAX_CHUNK_NAME.ClassDidMountContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin],
          });
        } else if (normalizeName === 'componentWillUnmount') {
          next.chunks.push({
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: RAX_CHUNK_NAME.ClassWillUnmountContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [RAX_CHUNK_NAME.ClassWillUnmountBegin],
          });
        } else {
          debug(`[CodeGen]: unknown life cycle: ${lifeCycleName}`);
        }
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: '_lifeCycles = this._defineLifeCycles();',
        linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: RAX_CHUNK_NAME.LifeCyclesBegin,
        content: `
          _defineLifeCycles() {
            const __$$lifeCycles = ({
        `,
        linkAfter: [RAX_CHUNK_NAME.ClassRenderEnd, CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod],
      });

      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: RAX_CHUNK_NAME.LifeCyclesEnd,
        content: `
            });

            // 为所有的方法绑定上下文
            Object.entries(__$$lifeCycles).forEach(([lifeCycleName, lifeCycleMethod]) => {
              if (typeof lifeCycleMethod === 'function') {
                __$$lifeCycles[lifeCycleName] = (...args) => {
                  return lifeCycleMethod.apply(this._context, args);
                }
              }
            });

            return __$$lifeCycles;
          }
        `,
        linkAfter: [RAX_CHUNK_NAME.LifeCyclesBegin, RAX_CHUNK_NAME.LifeCyclesContent],
      });
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
