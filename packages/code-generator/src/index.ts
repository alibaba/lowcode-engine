/**
 * 低代码引擎的出码模块，负责将编排产出的 Schema 转换成实际可执行的代码。
 *
 */
import { createProjectBuilder } from './generator/ProjectBuilder';
import { createModuleBuilder } from './generator/ModuleBuilder';
import { createDiskPublisher } from './publisher/disk';
import { createZipPublisher } from './publisher/zip';
import createIceJsProjectBuilder from './solutions/icejs';
import createRecoreProjectBuilder from './solutions/recore';
import createRaxAppProjectBuilder from './solutions/rax-app';

// 引入说明
import { REACT_CHUNK_NAME } from './plugins/component/react/const';
import { COMMON_CHUNK_NAME, CLASS_DEFINE_CHUNK_NAME, DEFAULT_LINK_AFTER } from './const/generator';

// 引入通用插件组
import esmodule from './plugins/common/esmodule';
import requireUtils from './plugins/common/requireUtils';
import containerClass from './plugins/component/react/containerClass';
import containerDataSource from './plugins/component/react/containerDataSource';
import containerInitState from './plugins/component/react/containerInitState';
import containerInjectUtils from './plugins/component/react/containerInjectUtils';
import containerLifeCycle from './plugins/component/react/containerLifeCycle';
import containerMethod from './plugins/component/react/containerMethod';
import jsx from './plugins/component/react/jsx';
import reactCommonDeps from './plugins/component/react/reactCommonDeps';
import css from './plugins/component/style/css';
import constants from './plugins/project/constants';
import i18n from './plugins/project/i18n';
import utils from './plugins/project/utils';
import prettier from './postprocessor/prettier';

// 引入常用工具
import * as utilsCommon from './utils/common';
import * as utilsCompositeType from './utils/compositeType';
import * as utilsJsExpression from './utils/jsExpression';
import * as utilsNodeToJSX from './utils/nodeToJSX';
import * as utilsTemplateHelper from './utils/templateHelper';

// 引入内置解决方案模块
import icejs from './plugins/project/framework/icejs';
import rax from './plugins/project/framework/rax';

export * from './types';

export default {
  createProjectBuilder,
  createModuleBuilder,
  solutions: {
    icejs: createIceJsProjectBuilder,
    recore: createRecoreProjectBuilder,
    rax: createRaxAppProjectBuilder,
  },
  solutionParts: {
    icejs,
    rax,
  },
  publishers: {
    disk: createDiskPublisher,
    zip: createZipPublisher,
  },
  plugins: {
    common: {
      esmodule,
      requireUtils,
    },
    react: {
      containerClass,
      containerDataSource,
      containerInitState,
      containerInjectUtils,
      containerLifeCycle,
      containerMethod,
      jsx,
      reactCommonDeps,
    },
    style: {
      css,
    },
    project: {
      constants,
      i18n,
      utils,
    },
  },
  postprocessor: {
    prettier,
  },
  utils: {
    common: utilsCommon,
    compositeType: utilsCompositeType,
    jsExpression: utilsJsExpression,
    nodeToJSX: utilsNodeToJSX,
    templateHelper: utilsTemplateHelper,
  },
  chunkNames: {
    COMMON_CHUNK_NAME,
    CLASS_DEFINE_CHUNK_NAME,
    REACT_CHUNK_NAME,
  },
  defaultLinkAfter: {
    COMMON_DEFAULT_LINK_AFTER: DEFAULT_LINK_AFTER,
  },
};
