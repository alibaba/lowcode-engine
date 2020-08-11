
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'package',
    'json',
    `
{
  "name": "@ali/rax-component-demo",
  "version": "1.0.0",
  "scripts": {
    "build": "rm -f ./dist/miniapp.tar.gz && npm run build:miniapp && cd build/miniapp && tar czf ../../dist/miniapp.tar.gz *",
    "build:miniapp": "build-scripts build",
    "start": "build-scripts start",
    "lint": "eslint --ext .js --ext .jsx ./"
  },
  "dependencies": {
    "rax": "^1.1.0",
    "rax-app": "^2.0.0",
    "rax-document": "^0.1.0",
    "rax-text": "^1.0.0",
    "rax-view": "^1.0.0"
  },
  "devDependencies": {
    "build-plugin-rax-app": "^5.0.0",
    "@alib/build-scripts": "^0.1.0",
    "@typescript-eslint/eslint-plugin": "^2.11.0",
    "@typescript-eslint/parser": "^2.11.0",
    "babel-eslint": "^10.0.3",
    "eslint": "^6.8.0",
    "eslint-config-rax": "^0.1.0",
    "eslint-plugin-import": "^2.20.0",
    "eslint-plugin-module": "^0.1.0",
    "eslint-plugin-react": "^7.18.0",
    "@ali/build-plugin-rax-app-def": "^1.0.0"
  }
}

    `,
  );

  return [[], file];
}
  