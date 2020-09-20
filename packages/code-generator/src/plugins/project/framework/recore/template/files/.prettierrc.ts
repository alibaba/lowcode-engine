import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
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
