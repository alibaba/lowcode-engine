
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    '.prettierrc',
    '',
    `
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 120,
  "trailingComma": "all"
}

    `,
  );

  return [[], file];
}
  