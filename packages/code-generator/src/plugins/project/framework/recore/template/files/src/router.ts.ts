import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'router',
    'ts',
    `
export default {
  baseDir: './pages',
  exact: true,
  routes: [
    { main: './page_index', path: '/' },
  ],
};
    `,
  );

  return [['src'], file];
}
