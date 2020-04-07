import { ReactElement, ReactNode } from 'react';
import { I18nData } from './i18n';
import { TipContent } from './tip';
import { IconType } from './icon';


export interface TitleConfig {
  label?: I18nData | ReactNode;
  tip?: TipContent;
  icon?: IconType;
  className?: string;
}

export type TitleContent = string | I18nData | ReactElement | TitleConfig;

