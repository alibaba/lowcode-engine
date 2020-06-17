import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
