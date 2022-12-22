import { IPublicTypeI18nData } from '..';
import { ReactNode } from 'react';
import { IPublicTypeTipConfig } from './tip-config';

export type TipContent = string | IPublicTypeI18nData | ReactNode | IPublicTypeTipConfig;
