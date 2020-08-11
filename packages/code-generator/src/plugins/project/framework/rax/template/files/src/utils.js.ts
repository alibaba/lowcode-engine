
import ResultFile from '../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'utils',
    'js',
    `
export default {};

    `,
  );

  return [['src'], file];
}
  