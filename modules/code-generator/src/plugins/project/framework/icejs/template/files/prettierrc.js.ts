import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.prettierrc',
    'js',
    `
const { prettier } = require('@ice/spec');

module.exports = prettier;
    `,
  );

  return [[], file];
}
