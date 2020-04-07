import { ReactNode } from 'react';

export interface I18nData {
  type: 'i18n';
  intl?: ReactNode;
  [key: string]: any;
}

// type checks
export function isI18nData(obj: any): obj is I18nData {
  return obj && obj.type === 'i18n';
}

export interface I18nMap {
  [lang: string]: { [key: string]: string };
}
