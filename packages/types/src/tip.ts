import { I18nData } from './i18n';
import { ReactNode } from 'react';

export interface TipConfig {
  className?: string;
  children?: I18nData | ReactNode;
  theme?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

export type TipContent = string | I18nData | ReactNode | TipConfig;
