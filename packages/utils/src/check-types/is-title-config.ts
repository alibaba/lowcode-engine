import { isI18nData } from './is-i18n-data';
import { isPlainObject } from '../is-plain-object';


export function isTitleConfig(obj: any): boolean {
  return isPlainObject(obj) && !isI18nData(obj);
}
