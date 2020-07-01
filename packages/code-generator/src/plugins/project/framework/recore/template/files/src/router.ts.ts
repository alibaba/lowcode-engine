
import ResultFile from '../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
