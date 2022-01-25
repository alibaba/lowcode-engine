import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.stylelintignore',
    '',
    `
# 忽略目录
build/
tests/
demo/

# node 覆盖率文件
coverage/
    `,
  );

  return [[], file];
}
