
import ResultFile from '../../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'utils',
    'ts',
    `
import toolkit from '@ali/vu-toolkit';
import fusion from '@ali/vu-fusion';
import dataSource from '@ali/vu-dataSource';
import legaoBuiltin from '@ali/vu-legao-builtin';
import formatter from '@ali/vu-formatter';

export default {
  ...toolkit,
  ...fusion,
  legaoBuiltin,
  dataSource,
  formatter
}

    `,
  );

  return [['src','config'], file];
}
  