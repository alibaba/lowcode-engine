import ResultDir from '../../../../../model/ResultDir';
import {
  IProjectTemplate,
  IResultDir,
} from '../../../../../types';

import { runFileGenerator } from '../../../../../utils/templateHelper';

import file0 from './files/.editorconfig'
import file1 from './files/.eslintignore'
import file2 from './files/.eslintrc.js'
import file3 from './files/.gitignore'
import file4 from './files/README.md'
import file5 from './files/abc.json'
import file6 from './files/build.json'
import file7 from './files/package.json'
import file8 from './files/src/app.js'
import file9 from './files/src/app.json'
import file10 from './files/src/document/index.jsx'
import file11 from './files/src/global.less'
import file12 from './files/src/pages/Home/index.css'
import file13 from './files/src/pages/Home/index.jsx'
import file14 from './files/src/utils.js'

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

  generateTemplate(): IResultDir {
    const root = new ResultDir('.');

    runFileGenerator(root, file0);
    runFileGenerator(root, file1);
    runFileGenerator(root, file2);
    runFileGenerator(root, file3);
    runFileGenerator(root, file4);
    runFileGenerator(root, file5);
    runFileGenerator(root, file6);
    runFileGenerator(root, file7);
    runFileGenerator(root, file8);
    runFileGenerator(root, file9);
    runFileGenerator(root, file10);
    runFileGenerator(root, file11);
    runFileGenerator(root, file12);
    runFileGenerator(root, file13);
    runFileGenerator(root, file14);

    return root;
  },
};

export default raxAppTemplate;
