import { ResultDir } from '@alilc/lowcode-types';
import { createResultDir } from '../../../../../utils/resultHelper';
import { runFileGenerator } from '../../../../../utils/templateHelper';

import file1 from './files/gitignore';
import file2 from './files/README.md';
import file3 from './files/browserslistrc';
import file4 from './files/typings';
import file5 from './files/document';
import file6 from './files/src/layouts/BasicLayout/components/Footer/index.jsx';
import file7 from './files/src/layouts/BasicLayout/components/Footer/index.style';
import file8 from './files/src/layouts/BasicLayout/components/Logo/index.jsx';
import file9 from './files/src/layouts/BasicLayout/components/Logo/index.style';
import file10 from './files/src/layouts/BasicLayout/components/PageNav/index.jsx';
import file11 from './files/src/layouts/BasicLayout/index.jsx';
import file12 from './files/src/layouts/BasicLayout/menuConfig.js';

export function generateStaticFiles(root = createResultDir('.')): ResultDir {
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

  return root;
}
