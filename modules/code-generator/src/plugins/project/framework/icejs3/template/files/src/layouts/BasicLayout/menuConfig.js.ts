import { ResultFile } from '@alilc/lowcode-types';
import { createResultFile } from '../../../../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'menuConfig',
    'js',
    `
const headerMenuConfig = [];
const asideMenuConfig = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'smile',
  },
];
export { headerMenuConfig, asideMenuConfig };
    `,
  );

  return [['src', 'layouts', 'BasicLayout'], file];
}
