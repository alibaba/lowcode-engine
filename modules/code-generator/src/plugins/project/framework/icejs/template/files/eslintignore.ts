import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.eslintignore',
    '',
    `
# 忽略目录
build/
tests/
demo/
.ice/

# node 覆盖率文件
coverage/

# 忽略文件
**/*-min.js
**/*.min.js

package-lock.json
yarn.lock
    `,
  );

  return [[], file];
}
