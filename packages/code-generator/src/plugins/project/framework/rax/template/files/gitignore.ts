import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.gitignore',
    '',
    `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
