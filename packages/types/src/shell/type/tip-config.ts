import { IPublicTypeI18nData } from '..';
import { ReactNode } from 'react';

export interface IPublicTypeTipConfig {
  className?: string;
  children?: IPublicTypeI18nData | ReactNode;
  theme?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}
