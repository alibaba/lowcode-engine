import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'index',
    'module.scss',
    `
.footer {
  line-height: 20px;
  text-align: center;
}

.logo {
  font-weight: bold;
  font-size: 16px;
}

.copyright {
  font-size: 12px;
}
    `,
  );

  return [['src', 'layouts', 'BasicLayout', 'components', 'Footer'], file];
}
