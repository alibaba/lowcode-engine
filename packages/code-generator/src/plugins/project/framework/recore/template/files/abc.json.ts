import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'abc',
    'json',
    `
{
  "name": "test",
  "assets": {
    "type": "command",
    "command": {
      "cmd": [
        "tnpm ii",
        "tnpm run build"
      ]
    }
  }
}

    `,
  );

  return [[], file];
}
