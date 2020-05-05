import { ReactElement, ReactNode } from 'react';
import { I18nData } from './i18n';
import { TipContent } from './tip';
import { IconType } from './icon';

export interface TitleConfig {
  label?: I18nData | ReactNode;
  tip?: TipContent;
  docUrl?: string;
  icon?: IconType;
  className?: string;
}

export type TitleContent = string | I18nData | ReactElement | TitleConfig;

export function isTitleConfig(obj: any): obj is TitleConfig {
  return obj && (obj.label || obj.tip || obj.icon);
}
