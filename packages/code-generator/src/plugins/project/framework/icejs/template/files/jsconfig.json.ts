import ResultFile from '@/model/ResultFile';
import { IResultFile } from '@/types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
