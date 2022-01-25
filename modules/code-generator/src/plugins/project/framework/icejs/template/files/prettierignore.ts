import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.prettierignore',
    '',
    `
build/
tests/
demo/
.ice/
coverage/
**/*-min.js
**/*.min.js
package-lock.json
yarn.lock
    `,
  );

  return [[], file];
}
