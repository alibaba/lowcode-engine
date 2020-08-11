
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'README',
    'md',
    `# @ali/rax-component-demo

## Getting Started

### \`npm run start\`

Runs the app in development mode.

Open [http://localhost:9999](http://localhost:9999) to view it in the browser.

The page will reload if you make edits.

### \`npm run build\`

Builds the app for production to the \`build\` folder.
`,
  );

  return [[], file];
}
