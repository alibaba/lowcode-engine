import { IProjectTemplate } from '../../../../../types';
import { generateStaticFiles } from './static-files';

const icejs3Template: IProjectTemplate = {
  slots: {
    components: {
      path: ['src', 'components'],
      fileName: 'index',
    },
    pages: {
      path: ['src', 'pages'],
      fileName: 'index',
    },
    entry: {
      path: ['src'],
      fileName: 'app',
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
    packageJSON: {
      path: [],
      fileName: 'package',
    },
    appConfig: {
      path: ['src'],
      fileName: 'app',
    },
    buildConfig: {
      path: [],
      fileName: 'ice.config',
    },
    layout: {
      path: ['src', 'pages'],
      fileName: 'layout',
    },
  },

  generateTemplate() {
    return generateStaticFiles();
  },
};

export default icejs3Template;
