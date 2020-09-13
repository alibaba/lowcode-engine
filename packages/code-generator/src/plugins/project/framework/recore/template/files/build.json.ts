
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'build',
    'json',
    `
{
  "entry": "src/index",
  "alias": {
    "@": "./src"
  },
  "publicPath": "./",
  "outputAssetsPath": {
    "js": "",
    "css": ""
  },
  "plugins": [
    "build-plugin-react-app",
    "@ali/build-plugin-recore-lowcode"
  ],
  "externals": { "react": "window.React", "react-dom": "window.ReactDOM", "@ali/recore": "window.Recore" }
}

    `,
  );

  return [[], file];
}
