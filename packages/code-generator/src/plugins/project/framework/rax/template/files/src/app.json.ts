
import ResultFile from '../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'app',
    'json',
    `
{
  "routes": [
    {
      "path": "/",
      "source": "pages/Home/index"
    }
  ],
  "window": {
    "title": "Rax App Demo"
  }
}

    `,
  );

  return [['src'], file];
}
  