import { NpmInfo } from './npm';
import { JSFunction } from './value-type';

export interface InternalUtils {
  name: string;
  type: 'function';
  content: JSFunction;
}

export interface ExternalUtils {
  name: string;
  type: 'npm' | 'tnpm';
  content: NpmInfo;
}

export type IUtilItem = InternalUtils | ExternalUtils;
export type UtilsMap = IUtilItem[];
