import { ResultDir } from '@alilc/lowcode-types';
import { IProjectTemplate } from '../../../../../types';
import { generateStaticFiles } from './static-files';

const raxAppTemplate: IProjectTemplate = {
  slots: {
    components: {
      path: ['src', 'components'],
    },
    pages: {
      path: ['src', 'pages'],
    },
    router: {
      path: ['src'],
      fileName: 'router',
    },
    entry: {
      path: ['src'],
      fileName: 'app',
    },
    appConfig: {
      path: ['src'],
      fileName: 'app',
    },
    buildConfig: {
      path: [],
      fileName: 'build',
    },
    constants: {
      path: ['src'],
      fileName: 'constants',
    },
    utils: {
      path: ['src'],
      fileName: 'utils',
    },
    i18n: {
      path: ['src'],
      fileName: 'i18n',
    },
    globalStyle: {
      path: ['src'],
      fileName: 'global',
    },
    htmlEntry: {
      path: ['src', 'document'],
      fileName: 'index',
    },
    packageJSON: {
      path: [],
      fileName: 'package',
    },
  },

  async generateTemplate(): Promise<ResultDir> {
    return generateStaticFiles();
  },
};

export default raxAppTemplate;
