
import ResultFile from '../../../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'index',
    'css',
    `

    `,
  );

  return [['src','pages','Home'], file];
}
  