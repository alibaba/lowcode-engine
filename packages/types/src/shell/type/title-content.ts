import { ReactElement, ReactNode } from 'react';
import { IPublicTypeI18nData, IPublicTypeTitleConfig } from './';

// eslint-disable-next-line max-len
export type IPublicTypeTitleContent = string | IPublicTypeI18nData | ReactElement | ReactNode | IPublicTypeTitleConfig;