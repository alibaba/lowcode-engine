import ResultDir from '../../../../../model/ResultDir';
import {
  IProjectTemplate,
  IResultDir,
} from '../../../../../types';
import { runFileGenerator } from '../../../../../utils/templateHelper';

import file1 from './files/abc.json';
import file2 from './files/build.json';
import file3 from './files/.editorconfig';
import file4 from './files/.eslintignore';
import file5 from './files/.gitignore';
import file6 from './files/.prettierrc';
import file7 from './files/README.md';
import file8 from './files/package.json';
import file9 from './files/public/index.html';
import file10 from './files/src/index.ts';
import file11 from './files/src/router.ts';
import file13 from './files/src/config/app.ts';
import file14 from './files/src/config/components.ts';
import file15 from './files/src/config/utils.ts';
import file16 from './files/tsconfig.json';

const icejsTemplate: IProjectTemplate = {
  slots: {
    pages: {
      path: ['src', 'pages'],
    },
  },

  generateTemplate(): IResultDir {
    const root = new ResultDir('.');

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
    runFileGenerator(root, file13);
    runFileGenerator(root, file14);
    runFileGenerator(root, file15);
    runFileGenerator(root, file16);

    return root;
  },
};

export default icejsTemplate;
