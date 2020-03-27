import ResultFile from '@/model/ResultFile';
import { IResultFile } from '@/types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    '.stylelintrc',
    'js',
    `
const { stylelint } = require('@ice/spec');

module.exports = stylelint;
    `,
  );

  return [[], file];
}
