import { I18nData } from './i18n';
import { ReactNode, ReactElement } from 'react';

export interface TipConfig {
  className?: string;
  children?: I18nData | ReactNode;
  theme?: string;
  direction?: string; // 'n|s|w|e|top|bottom|left|right';
}

export type TipContent = string | I18nData | ReactElement | TipConfig;
