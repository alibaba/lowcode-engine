import { COMMON_CHUNK_NAME } from '../../../../../const/generator';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
  IPackageJSON,
  IProjectInfo,
} from '../../../../../types';

interface IIceJsPackageJSON extends IPackageJSON {
  ideMode: {
    name: string;
  };
  iceworks: {
    type: string;
    adapter: string;
  };
  originTemplate: string;
}

// TODO: How to merge this logic to common deps
const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IProjectInfo;

  const packageJson: IIceJsPackageJSON = {
    name: '@alifd/scaffold-lite-js',
    version: '0.1.5',
    description: '轻量级模板，使用 JavaScript，仅包含基础的 Layout。',
    dependencies: {
      moment: '^2.24.0',
      react: '^16.4.1',
      'react-dom': '^16.4.1',
      '@alifd/theme-design-pro': '^0.x',
    },
    devDependencies: {
      '@ice/spec': '^1.0.0',
      'build-plugin-fusion': '^0.1.0',
      'build-plugin-moment-locales': '^0.1.0',
      eslint: '^6.0.1',
      'ice.js': '^1.0.0',
      stylelint: '^13.2.0',
      '@ali/build-plugin-ice-def': '^0.1.0',
    },
    scripts: {
      start: 'icejs start',
      build: 'icejs build',
      lint: 'npm run eslint && npm run stylelint',
      eslint: 'eslint --cache --ext .js,.jsx ./',
      stylelint: 'stylelint ./**/*.scss',
    },
    ideMode: {
      name: 'ice-react',
    },
    iceworks: {
      type: 'react',
      adapter: 'adapter-react-v3',
    },
    engines: {
      node: '>=8.0.0',
    },
    repository: {
      type: 'git',
      url: 'http://gitlab.alibaba-inc.com/msd/leak-scan/tree/master',
    },
    private: true,
    originTemplate: '@alifd/scaffold-lite-js',
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

export default plugin;
