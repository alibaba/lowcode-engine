import { ResultDir } from '@ali/lowcode-types';
import { IProjectTemplate } from '../../../../../types';

import { createResultDir } from '../../../../../utils/resultHelper';
import { runFileGenerator } from '../../../../../utils/templateHelper';

import file12 from './files/abc.json';
import file11 from './files/build.json';
import file10 from './files/editorconfig';
import file9 from './files/eslintignore';
import file8 from './files/eslintrc.js';
import file7 from './files/gitignore';
import file6 from './files/jsconfig.json';
import file5 from './files/prettierignore';
import file4 from './files/prettierrc.js';
import file13 from './files/README.md';
import file16 from './files/src/layouts/BasicLayout/components/Footer/index.jsx';
import file17 from './files/src/layouts/BasicLayout/components/Footer/index.module.scss';
import file18 from './files/src/layouts/BasicLayout/components/Logo/index.jsx';
import file19 from './files/src/layouts/BasicLayout/components/Logo/index.module.scss';
import file20 from './files/src/layouts/BasicLayout/components/PageNav/index.jsx';
import file14 from './files/src/layouts/BasicLayout/index.jsx';
import file15 from './files/src/layouts/BasicLayout/menuConfig.js';
import file3 from './files/stylelintignore';
import file2 from './files/stylelintrc.js';
import file1 from './files/tsconfig.json';

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
    const root = createResultDir('.');

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
    runFileGenerator(root, file15);
    runFileGenerator(root, file16);
    runFileGenerator(root, file17);
    runFileGenerator(root, file18);
    runFileGenerator(root, file19);
    runFileGenerator(root, file20);

    return root;
  },
};

export default icejsTemplate;
