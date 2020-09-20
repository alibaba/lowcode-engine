import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
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
