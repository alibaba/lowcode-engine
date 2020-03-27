import ResultFile from '@/model/ResultFile';
import { IResultFile } from '@/types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    '.prettierrc',
    'js',
    `
const { prettier } = require('@ice/spec');

module.exports = prettier;
    `,
  );

  return [[], file];
}
