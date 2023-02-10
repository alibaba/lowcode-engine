import { IPublicTypeNpmInfo, PackageJSON } from '@alilc/lowcode-types';
import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IProjectInfo,
} from '../../../../../types';
import { isNpmInfo } from '../../../../../utils/schema';
import { getErrorMessage } from '../../../../../utils/errors';
import { calcCompatibleVersion } from '../../../../../utils/version';
import { RaxFrameworkOptions } from '../types/RaxFrameworkOptions';
import { buildDataSourceDependencies } from '../../../../../utils/dataSource';

const pluginFactory: BuilderComponentPluginFactory<RaxFrameworkOptions> = (cfg) => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;

    const npmDeps = getNpmDependencies(ir);

    const packageJson: PackageJSON = {
      name: cfg?.packageName || 'rax-demo-app',
      private: true,
      version: cfg?.packageVersion || '1.0.0',
      scripts: {
        start: 'rax-app start',
        build: 'rax-app build',
        eslint: 'eslint --ext .js,.jsx ./',
        stylelint: 'stylelint "**/*.{css,scss,less}"',
        prettier: 'prettier **/* --write',
        lint: 'npm run eslint && npm run stylelint',
      },
      dependencies: {
        // 数据源相关的依赖:
        ...buildDataSourceDependencies(ir, cfg?.datasourceConfig),

        // 环境判断
        'universal-env': '^3.2.0',

        // 国际化相关依赖:
        'intl-messageformat': '^9.3.6',

        // 基础库
        rax: '^1.1.0',
        'rax-document': '^0.1.6',

        // 其他组件库
        ...npmDeps.reduce<Record<string, string>>(
          (acc, npm) => ({
            ...acc,
            [npm.package]: npm.version || '*',
          }),
          {},
        ),
      },
      devDependencies: {
        '@iceworks/spec': '^1.0.0',
        'rax-app': '^3.0.0',
        eslint: '^6.8.0',
        prettier: '^2.1.2',
        stylelint: '^13.7.2',
      },
    };

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

function getNpmDependencies(project: IProjectInfo): IPublicTypeNpmInfo[] {
  const npmDeps: IPublicTypeNpmInfo[] = [];
  const npmNameToPkgMap = new Map<string, IPublicTypeNpmInfo>();

  const allDeps = project.packages;

  allDeps.forEach((dep) => {
    if (!isNpmInfo(dep)) {
      return;
    }

    const existing = npmNameToPkgMap.get(dep.package);
    if (!existing) {
      npmNameToPkgMap.set(dep.package, dep);
      npmDeps.push(dep);
      return;
    }

    if (existing.version !== dep.version) {
      try {
        npmNameToPkgMap.set(dep.package, {
          ...existing,
          version: calcCompatibleVersion(existing.version, dep.version),
        });
      } catch (e) {
        throw new Error(
          `Cannot find compatible version for ${dep.package}. Detail: ${getErrorMessage(e)}`,
        );
      }
    }
  });

  return npmDeps;
}
