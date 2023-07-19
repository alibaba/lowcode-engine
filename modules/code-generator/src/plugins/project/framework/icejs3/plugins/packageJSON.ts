import { PackageJSON } from '@alilc/lowcode-types';

import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../../../../types';
import { buildDataSourceDependencies } from '../../../../../utils/dataSource';

interface IIceJs3PackageJSON extends PackageJSON {
  originTemplate: string;
}

export type IceJs3PackageJsonPluginConfig = {

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

  /** 包名 */
  packageName?: string;

  /** 版本 */
  packageVersion?: string;
};

const pluginFactory: BuilderComponentPluginFactory<IceJs3PackageJsonPluginConfig> = (cfg) => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;

    const packageJson: IIceJs3PackageJSON = {
      name: cfg?.packageName || 'icejs3-demo-app',
      version: cfg?.packageVersion || '0.1.5',
      description: 'icejs 3 轻量级模板，使用 JavaScript，仅包含基础的 Layout。',
      dependencies: {
        moment: '^2.24.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router': '^6.9.0',
        'react-router-dom': '^6.9.0',
        'intl-messageformat': '^9.3.6',
        '@alifd/next': '1.26.15',
        '@ice/runtime': '~1.1.0',
        // 数据源相关的依赖:
        ...buildDataSourceDependencies(ir, cfg?.datasourceConfig),
      },
      devDependencies: {
        '@ice/app': '~3.1.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        '@types/node': '^18.11.17',
        '@ice/plugin-fusion': '^1.0.1',
        '@ice/plugin-moment-locales': '^1.0.0',
        eslint: '^6.0.1',
        stylelint: '^13.2.0',
      },
      scripts: {
        start: 'ice start',
        build: 'ice build',
        lint: 'npm run eslint && npm run stylelint',
        eslint: 'eslint --cache --ext .js,.jsx ./',
        stylelint: 'stylelint ./**/*.scss',
      },
      engines: {
        node: '>=14.0.0',
      },
      repository: {
        type: 'git',
        url: 'http://gitlab.xxx.com/msd/leak-scan/tree/master',
      },
      private: true,
      originTemplate: '@alifd/scaffold-lite-js',
    };

    ir.packages.forEach((packageInfo) => {
      packageJson.dependencies[packageInfo.package] = packageInfo.version;
    });

    next.chunks.push({
      type: ChunkType.JSON,
      fileType: FileType.JSON,
      name: COMMON_CHUNK_NAME.FileMainContent,
      content: packageJson,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
