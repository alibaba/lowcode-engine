
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
  