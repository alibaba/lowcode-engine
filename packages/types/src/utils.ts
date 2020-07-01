import { NpmInfo } from './npm';

export type UtilsMap = Array<
| {
    name: string;
    type: 'npm';
    content: NpmInfo;
  }
| {
    name: string;
    type: '';
  }
>;
