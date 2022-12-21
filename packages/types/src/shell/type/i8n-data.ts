import { ReactNode } from 'react';

export interface IPublicTypeI18nData {
  type: 'i18n';
  intl?: ReactNode;
  [key: string]: any;
}
