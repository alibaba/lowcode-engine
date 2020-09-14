import { ReactElement, ReactNode } from 'react';
import { I18nData, isI18nData } from './i18n';
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

function isPlainObject(value: any): value is Record<string, unknown> {
  if (typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null;
}

export function isTitleConfig(obj: any): obj is TitleConfig {
  return isPlainObject(obj) && !isI18nData(obj);
}
