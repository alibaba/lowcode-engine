import { I18nData } from '@alilc/lowcode-types';

// type checks

export function isI18nData(obj: any): obj is I18nData {
  return obj && obj.type === 'i18n';
}
