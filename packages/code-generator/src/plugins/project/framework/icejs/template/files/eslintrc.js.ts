import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    '.eslintrc',
    'js',
    `
const { eslint } = require('@ice/spec');

module.exports = eslint;
    `,
  );

  return [[], file];
}
