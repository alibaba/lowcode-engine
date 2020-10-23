import _ from 'lodash';

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

type PluginConfig = {
  fileType: string;
  exportNameMapping: Record<string, string>;
  normalizeNameMapping: Record<string, string>;
};

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    exportNameMapping: {},
    normalizeNameMapping: {},
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    // Rax 先只支持 didMount 和 willUnmount 吧

    const ir = next.ir as IContainerInfo;
    const lifeCycles = ir.lifeCycles;

    if (lifeCycles && !_.isEmpty(lifeCycles)) {
      Object.entries(lifeCycles).forEach(([lifeCycleName, lifeCycleMethodExpr]) => {
        const normalizeName = cfg.normalizeNameMapping[lifeCycleName] || lifeCycleName;
        const exportName = cfg.exportNameMapping[lifeCycleName] || lifeCycleName;

        next.chunks.push({
          type: ChunkType.STRING,
          fileType: cfg.fileType,
          name: RAX_CHUNK_NAME.LifeCyclesContent,
          content: `${exportName}: (${lifeCycleMethodExpr.value}),`,
          linkAfter: [RAX_CHUNK_NAME.LifeCyclesBegin],
        });

        if (normalizeName === 'didMount') {
          next.chunks.push({
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: RAX_CHUNK_NAME.ClassDidMountContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin],
          });
        } else if (normalizeName === 'willUnmount') {
          next.chunks.push({
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: RAX_CHUNK_NAME.ClassWillUnmountContent,
            content: `this._lifeCycles.${exportName}();`,
            linkAfter: [RAX_CHUNK_NAME.ClassWillUnmountBegin],
          });
        } else {
          // TODO: print warnings? Unknown life cycle
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
