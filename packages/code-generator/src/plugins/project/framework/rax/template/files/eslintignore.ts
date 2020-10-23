import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.eslintignore',
    '',
    `# 忽略目录
build/
tests/
demo/

# node 覆盖率文件
coverage/

# 忽略文件
**/*-min.js
**/*.min.js
`,
  );

  return [[], file];
}
