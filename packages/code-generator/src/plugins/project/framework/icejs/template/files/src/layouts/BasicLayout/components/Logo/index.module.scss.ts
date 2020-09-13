import ResultFile from '../../../../../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
