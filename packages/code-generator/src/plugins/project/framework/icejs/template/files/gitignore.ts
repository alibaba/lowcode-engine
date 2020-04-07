import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
