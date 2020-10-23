import { NpmInfo } from './npm';
import { JSExpression, JSFunction } from './value-type';

export type InternalUtils = {
  name: string;
  type: 'function';
  content: JSFunction | JSExpression;
};

export type ExternalUtils = {
  name: string;
  type: 'npm' | 'tnpm';
  content: NpmInfo;
};

export type UtilItem = InternalUtils | ExternalUtils;
export type UtilsMap = UtilItem[];
