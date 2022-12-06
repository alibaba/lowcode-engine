import { I18nData } from '../i18n';

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isI18nData(obj: any): obj is I18nData {
  return obj && obj.type === 'i18n';
}
