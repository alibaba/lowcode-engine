import { isI18nData } from './isI18nData';
import { isPlainObject } from './isPlainObject';
import { IPublicTypeTitleConfig } from '../shell/type/title-config';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isTitleConfig(obj: any): obj is IPublicTypeTitleConfig {
  return isPlainObject(obj) && !isI18nData(obj);
}
