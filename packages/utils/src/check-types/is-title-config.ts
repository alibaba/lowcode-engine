import { isI18nData } from './is-i18n-data';
import { isPlainObject } from '../is-plain-object';
import { TitleConfig } from '@alilc/lowcode-types';


export function isTitleConfig(obj: any): obj is TitleConfig {
  return isPlainObject(obj) && !isI18nData(obj);
}
