
import ResultFile from '../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'README',
    'md',
    `
# runtime-code

乐高接出码模块测试项目


## 安装运行

```bash
# install dependencies
tnpm install

# serve with hot reload at localhost:8080
npm start

# test projects
npm test

# local build
npm run build
```

    `,
  );

  return [[], file];
}
  