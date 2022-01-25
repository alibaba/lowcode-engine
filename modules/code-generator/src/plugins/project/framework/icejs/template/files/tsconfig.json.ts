import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'tsconfig',
    'json',
    `
{
  "compileOnSave": false,
  "buildOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "build",
    "module": "esnext",
    "target": "es6",
    "jsx": "react",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "rootDir": "./",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": false,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"],
      "ice": [".ice/index.ts"],
      "ice/*": [".ice/pages/*"]
    }
  },
  "include": ["src/*", ".ice"],
  "exclude": ["node_modules", "build", "public"]
}
    `,
  );

  return [[], file];
}
