import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
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
