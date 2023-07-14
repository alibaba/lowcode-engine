import { CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from '../../../const/generator';
import { REACT_CHUNK_NAME } from './const';

import { generateFunction } from '../../../utils/jsExpression';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';
import { isJSFunction, isJSExpression } from '@alilc/lowcode-types';
import { isJSExpressionFn } from '../../../utils/common';

export interface PluginConfig {
  fileType?: string;
  exportNameMapping?: Record<string, string>;
  normalizeNameMapping?: Record<string, string>;
  exclude?: string[];
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg = {
    fileType: FileType.JSX,
    exportNameMapping: {},
    normalizeNameMapping: {},
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    if (ir.lifeCycles) {
      const { lifeCycles } = ir;
      const chunks = Object.keys(lifeCycles).map<ICodeChunk | null>((lifeCycleName) => {
        // 过滤掉非法数据（有些场景下会误传入空字符串或 null)
        if (
          !isJSFunction(lifeCycles[lifeCycleName]) &&
          !isJSExpressionFn(lifeCycles[lifeCycleName]) &&
          !isJSExpression(lifeCycles[lifeCycleName])
        ) {
          return null;
        }

        let normalizeName;
        // constructor会取到对象的构造函数
        if (lifeCycleName === 'constructor') {
          normalizeName = lifeCycleName;
        } else {
          normalizeName = cfg.normalizeNameMapping[lifeCycleName] || lifeCycleName;
        }

        if (cfg?.exclude?.includes(normalizeName)) {
          return null;
        }

        const exportName = cfg.exportNameMapping[lifeCycleName] || lifeCycleName;
        if (normalizeName === 'constructor') {
          return {
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]],
          };
        }

        if (normalizeName === 'componentDidMount') {
          return {
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: REACT_CHUNK_NAME.ClassDidMountContent,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [REACT_CHUNK_NAME.ClassDidMountStart],
          };
        }

        if (normalizeName === 'render') {
          return {
            type: ChunkType.STRING,
            fileType: cfg.fileType,
            name: REACT_CHUNK_NAME.ClassRenderPre,
            content: generateFunction(lifeCycles[lifeCycleName], { isBlock: true }),
            linkAfter: [REACT_CHUNK_NAME.ClassRenderStart],
          };
        }

        return {
          type: ChunkType.STRING,
          fileType: cfg.fileType,
          name: CLASS_DEFINE_CHUNK_NAME.InsMethod,
          content: generateFunction(lifeCycles[lifeCycleName], {
            name: exportName,
            isMember: true,
          }),
          linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.InsMethod]],
        };
      }).filter((i) => !!i);

      next.chunks.push(...chunks.filter((x): x is ICodeChunk => x !== null));
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
