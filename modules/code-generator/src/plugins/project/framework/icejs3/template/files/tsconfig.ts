import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'tsconfig',
    'json',
    `
{
  "compilerOptions": {
    "baseUrl": "./",
    "module": "ESNext",
    "target": "ESNext",
    "lib": ["DOM", "ESNext", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": false,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"],
      "ice": [".ice"]
    }
  },
  "include": ["src", ".ice"],
  "exclude": ["build"]
}
    `,
  );

  return [[], file];
}
