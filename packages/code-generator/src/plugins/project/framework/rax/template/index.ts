import { ResultDir } from '@ali/lowcode-types';
import { IProjectTemplate } from '../../../../../types';

import { runFileGenerator } from '../../../../../utils/templateHelper';
import { createResultDir } from '../../../../../utils/resultHelper';

import file0 from './files/.editorconfig';
import file1 from './files/.eslintignore';
import file2 from './files/.eslintrc.js';
import file3 from './files/.gitignore';
import file4 from './files/README.md';
import file5 from './files/abc.json';
import file6 from './files/build.json';

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

  generateTemplate(): ResultDir {
    const root = createResultDir('.');

    runFileGenerator(root, file0);
    runFileGenerator(root, file1);
    runFileGenerator(root, file2);
    runFileGenerator(root, file3);
    runFileGenerator(root, file4);
    runFileGenerator(root, file5);
    runFileGenerator(root, file6);

    return root;
  },
};

export default raxAppTemplate;
