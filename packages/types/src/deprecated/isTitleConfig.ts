import { isI18nData } from './isI18nData';
import { isPlainObject } from './isPlainObject';
import { TitleConfig } from '../title';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isTitleConfig(obj: any): obj is TitleConfig {
  return isPlainObject(obj) && !isI18nData(obj);
}
