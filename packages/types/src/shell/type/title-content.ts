import type { ReactElement, ReactNode } from 'react';
import type { IPublicTypeI18nData, IPublicTypeTitleConfig } from './';

// eslint-disable-next-line max-len
export type IPublicTypeTitleContent =
  | string
  | IPublicTypeI18nData
  | ReactElement
  | ReactNode
  | IPublicTypeTitleConfig;
