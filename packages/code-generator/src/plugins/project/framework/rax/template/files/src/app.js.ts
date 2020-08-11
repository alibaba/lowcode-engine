
import ResultFile from '../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'app',
    'js',
    `
import { runApp } from 'rax-app';
import appConfig from './app.json';

runApp(appConfig);

    `,
  );

  return [['src'], file];
}
  