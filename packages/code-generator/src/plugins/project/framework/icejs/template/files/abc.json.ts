import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'abc',
    'json',
    `
{
  "type": "ice-app",
  "builder": "@ali/builder-ice-app"
}
    `,
  );

  return [[], file];
}
