
import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.eslintrc',
    'js',
    `module.exports = {
  extends: ['rax'],
};
`,
  );

  return [[], file];
}
