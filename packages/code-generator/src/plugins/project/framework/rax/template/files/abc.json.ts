import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'abc',
    'json',
    `{
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
