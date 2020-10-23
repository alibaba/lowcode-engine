
import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.eslintignore',
    '',
    `
.idea
.vscode
.theia
.recore
build/
.*
~*
node_modules

packages/solution

    `,
  );

  return [[], file];
}
