import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
