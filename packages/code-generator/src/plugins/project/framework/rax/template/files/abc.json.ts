
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'abc',
    'json',
    `
{
  "type": "rax",
  "builder": "@ali/builder-rax-v1",
  "info": {
    "raxVersion": "1.x"
  }
}

    `,
  );

  return [[], file];
}
  