import { NpmInfo } from './npm';
import { JSExpression, JSFunction } from './value-type';

export type UtilItem =
  | {
      name: string;
      type: 'npm';
      content: NpmInfo;
    }
  | {
      name: string;
      type: 'tnpm';
      content: NpmInfo;
    }
  | {
      name: string;
      type: 'function';
      content: JSFunction | JSExpression;
    };

export type UtilsMap = UtilItem[];
