import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'jsconfig',
    'json',
    `
{
  "compilerOptions": {
    "baseUrl": ".",
    "jsx": "react",
    "paths": {
      "@/*": ["./src/*"],
      "ice": [".ice/index.ts"],
      "ice/*": [".ice/pages/*"]
    }
  }
}
    `,
  );

  return [[], file];
}
