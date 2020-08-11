
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    '.gitignore',
    '',
    `
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

*~
*.swp
*.log

.DS_Store
.idea/
.temp/

build/
dist/
lib/
coverage/
node_modules/

template.yml

    `,
  );

  return [[], file];
}
  