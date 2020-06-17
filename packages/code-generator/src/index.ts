/**
 * 低代码引擎的出码模块，负责将编排产出的 Schema 转换成实际可执行的代码。
 *
 */
import { createProjectBuilder } from './generator/ProjectBuilder';
import { createDiskPublisher } from './publisher/disk';
import createIceJsProjectBuilder from './solutions/icejs';

export * from './types';

export default {
  createProjectBuilder,
  solutions: {
    icejs: createIceJsProjectBuilder,
  },
  publishers: {
    disk: createDiskPublisher,
  },
};
