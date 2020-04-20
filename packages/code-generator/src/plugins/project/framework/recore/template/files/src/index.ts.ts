
import ResultFile from '../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'index',
    'ts',
    `
import { app } from '@ali/lowcode-runtime';
import Shell from '@ali/vc-shell';
import StaticRender from './plugins/provider';

// 注册布局组件，可注册多个
app.registerLayout(Shell, {
  componentName: 'BasicLayout',
});

app.registerProvider(StaticRender);

app.run();

    `,
  );

  return [['src'], file];
}
  