import { IPublicTypeTitleConfig } from '@alilc/lowcode-types';
import { isI18nData } from './is-i18n-data';
import { isPlainObject } from '../is-plain-object';

export function isTitleConfig(obj: any): obj is IPublicTypeTitleConfig {
  return isPlainObject(obj) && !isI18nData(obj);
}
