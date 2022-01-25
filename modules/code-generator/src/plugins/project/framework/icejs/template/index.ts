import { ResultDir } from '@alilc/lowcode-types';
import { IProjectTemplate } from '../../../../../types';
import { generateStaticFiles } from './static-files';

const icejsTemplate: IProjectTemplate = {
  slots: {
    components: {
      path: ['src', 'components'],
    },
    pages: {
      path: ['src', 'pages'],
    },
    router: {
      path: ['src'],
      fileName: 'routes',
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
    htmlEntry: {
      path: ['public'],
      fileName: 'index',
    },
    packageJSON: {
      path: [],
      fileName: 'package',
    },
  },

  generateTemplate(): ResultDir {
    return generateStaticFiles();
  },
};

export default icejsTemplate;
