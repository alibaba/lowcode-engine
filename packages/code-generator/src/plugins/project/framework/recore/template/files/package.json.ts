
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'package',
    'json',
    `
{
  "name": "test",
  "version": "1.0.0",
  "description": "test",
  "scripts": {
    "start": "build-scripts start",
    "build": "build-scripts build",
    "test": "build-scripts test"
  },
  "engines": {
    "node": ">= 8.9.0",
    "npm": ">=6.1.0"
  },
  "dependencies": {
    "@ali/recore": "^1.6.10",
    "@ali/lowcode-runtime": "^0.8.0",
    "@ali/recore-renderer": "^0.0.1",
    "@ali/vc-shell": "1.3.1",
    "@ali/vc-block": "^3.0.3-beta.1",
    "@ali/vc-deep": "1.2.38",
    "@ali/vc-div": "^1.0.1",
    "@ali/vc-page": "^1.0.5",
    "@ali/vc-slot": "^2.0.1",
    "@ali/vc-text": "^4.0.1",
    "@ali/vu-dataSource": "^1.0.4",
    "@ali/vu-formatter": "^2.0.0",
    "@ali/vu-fusion": "^2.0.1-beta.0",
    "@ali/vu-legao-builtin": "^1.4.0-beta.2",
    "react": "^16"
  },
  "devDependencies": {
    "build-plugin-react-app": "^1.0.15",
    "@ali/build-plugin-recore-lowcode": "^0.0.1",
    "@alib/build-scripts": "^0.1.0",
    "@types/node": "^7",
    "@types/react": "^16",
    "eslint": "^6.5.1",
    "tslib": "^1.9.3",
    "typescript": "^3.1.3",
    "prettier": "^1.18.2"
  },
  "lint-staged": {
    "./src/**/*.{ts,tsx}": [
      "tslint --fix",
      "git add"
    ]
  },
  "nowa": {
    "solution": "@ali/nowa-recore-solution"
  }
}

    `,
  );

  return [[], file];
}
  