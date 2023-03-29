import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'index',
    'module.scss',
    `
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text1-1;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;

  &:visited, &:link {
    color: $color-text1-1;
  }

  img {
    height: 24px;
    margin-right: 10px;
  }
}
    `,
  );

  return [['src', 'layouts', 'BasicLayout', 'components', 'Logo'], file];
}
