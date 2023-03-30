/**
 * 低代码引擎的出码模块，负责将编排产出的 Schema 转换成实际可执行的代码。
 * 注意：为了保持 API 的稳定性，这里所有导出的 API 均要显式命名方式导出
 *     （即用 export { xxx } from 'xx' 的方式，不要直接 export * from 'xxx')
 *      而且所有导出的 API 务必在 tests/public 中编写单元测试
 */
import { createProjectBuilder } from './generator/ProjectBuilder';
import { createModuleBuilder } from './generator/ModuleBuilder';
import { createDiskPublisher } from './publisher/disk';
import { createZipPublisher } from './publisher/zip';
import createIceJsProjectBuilder, { plugins as icejsPlugins } from './solutions/icejs';
import createIce3JsProjectBuilder, { plugins as icejs3Plugins } from './solutions/icejs3';
import createRaxAppProjectBuilder, { plugins as raxPlugins } from './solutions/rax-app';

// 引入说明
import { REACT_CHUNK_NAME } from './plugins/component/react/const';
import { COMMON_CHUNK_NAME, CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from './const/generator';

// 引入通用插件组
import esmodule from './plugins/common/esmodule';
import requireUtils from './plugins/common/requireUtils';
import styleImport from './plugins/common/styleImport';

import css from './plugins/component/style/css';
import constants from './plugins/project/constants';
import i18n from './plugins/project/i18n';
import utils from './plugins/project/utils';
import prettier from './postprocessor/prettier';

// 引入全局常用工具
import * as globalUtils from './utils';

import * as CONSTANTS from './const';

// 引入内置解决方案模块
import icejs from './plugins/project/framework/icejs';
import icejs3 from './plugins/project/framework/icejs3';
import rax from './plugins/project/framework/rax';

export default {
  createProjectBuilder,
  createModuleBuilder,
  solutions: {
    icejs: createIceJsProjectBuilder,
    icejs3: createIce3JsProjectBuilder,
    rax: createRaxAppProjectBuilder,
  },
  solutionParts: {
    icejs,
    icejs3,
    rax,
  },
  publishers: {
    disk: createDiskPublisher,
    zip: createZipPublisher,
  },
  plugins: {
    common: {

      /**
       * 处理 ES Module
       * @deprecated please use esModule
       */
      esmodule,
      esModule: esmodule,
      requireUtils,
      styleImport,
    },
    style: {
      css,
    },
    project: {
      constants,
      i18n,
      utils,
    },
    icejs: {
      ...icejsPlugins,
    },
    icejs3: {
      ...icejs3Plugins,
    },
    rax: {
      ...raxPlugins,
    },

    /**
     * @deprecated please use icejs
     */
    react: {
      ...icejsPlugins,
    },
  },
  postprocessor: {
    prettier,
  },
  utils: globalUtils,
  chunkNames: {
    COMMON_CHUNK_NAME,
    CLASS_DEFINE_CHUNK_NAME,
    REACT_CHUNK_NAME,
  },
  defaultLinkAfter: {
    COMMON_DEFAULT_LINK_AFTER: DEFAULT_LINK_AFTER,
  },
  constants: CONSTANTS,
};

// 一些类型定义
export * from './types';

// 一些常量定义
export * from './const';

// 一些工具函数
export * from './analyzer/componentAnalyzer';
export * from './parser/SchemaParser';
export * from './generator/ChunkBuilder';
export * from './generator/CodeBuilder';
export * from './generator/ModuleBuilder';
export * from './generator/ProjectBuilder';
