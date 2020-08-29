import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IPackageJSON,
  IProjectInfo,
  NpmInfo,
} from '../../../../../types';
import { isNpmInfo } from '../../../../../utils/schema';
import { calcCompatibleVersion } from '../../../../../utils/version';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IProjectInfo;

    const npmDeps = getNpmDependencies(ir);

    const packageJson: IPackageJSON = {
      name: '@ali/rax-app-demo',
      private: true,
      version: '1.0.0',
      scripts: {
        build: 'build-scripts build',
        start: 'build-scripts start',
        lint: 'eslint --ext .js --ext .jsx ./',
      },
      dependencies: {
        '@ali/lowcode-datasource-engine': '^0.1.0',
        'universal-env': '^3.2.0',
        'intl-messageformat': '^9.3.6',
        rax: '^1.1.0',
        'rax-app': '^2.0.0',
        'rax-document': '^0.1.0',
        ...npmDeps.reduce(
          (acc, npm) => ({
            ...acc,
            [npm.package]: npm.version || '*',
          }),
          {} as Record<string, string>,
        ),
      },
      devDependencies: {
        'build-plugin-rax-app': '^5.0.0',
        '@alib/build-scripts': '^0.1.0',
        '@typescript-eslint/eslint-plugin': '^2.11.0',
        '@typescript-eslint/parser': '^2.11.0',
        'babel-eslint': '^10.0.3',
        eslint: '^6.8.0',
        'eslint-config-rax': '^0.1.0',
        'eslint-plugin-import': '^2.20.0',
        'eslint-plugin-module': '^0.1.0',
        'eslint-plugin-react': '^7.18.0',
        '@ali/build-plugin-rax-app-def': '^1.0.0',
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

function getNpmDependencies(project: IProjectInfo): NpmInfo[] {
  const npmDeps: NpmInfo[] = [];
  const npmNameToPkgMap = new Map<string, NpmInfo>();

  const allDeps = [...(project.containersDeps || []), ...(project.utilsDeps || [])];

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
        throw new Error(`Cannot find compatible version for ${dep.package}. Detail: ${e.message}`);
      }
    }
  });

  return npmDeps;
}
