
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'build',
    'json',
    `{
  "inlineStyle": false,
  "plugins": [
    [
      "build-plugin-rax-app",
      {
        "targets": ["web", "miniapp"]
      }
    ],
    "@ali/build-plugin-rax-app-def"
  ]
}
`,
  );

  return [[], file];
}
