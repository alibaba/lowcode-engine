
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
  