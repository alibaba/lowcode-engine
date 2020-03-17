import ResultFile from '@/model/ResultFile';
import { IResultFile } from '@/types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
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
