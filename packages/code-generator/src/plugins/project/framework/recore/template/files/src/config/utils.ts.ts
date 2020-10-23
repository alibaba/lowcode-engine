import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
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

  return [['src', 'config'], file];
}
