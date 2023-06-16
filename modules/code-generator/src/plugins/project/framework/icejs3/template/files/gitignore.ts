import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.gitignore',
    '',
    `
# See https://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
node_modules/

# production
build/
dist/
tmp/
lib/

# misc
.idea/
.happypack
.DS_Store
*.swp
*.dia~
.ice

npm-debug.log*
yarn-debug.log*
yarn-error.log*
index.module.scss.d.ts
    `,
  );

  return [[], file];
}
