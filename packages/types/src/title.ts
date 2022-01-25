import { ReactElement, ReactNode } from 'react';
import { I18nData, isI18nData } from './i18n';
import { TipContent } from './tip';
import { IconType } from './icon';

/**
 * 描述 props 的 setter title
 */
export interface TitleConfig {
  /**
   * 文字描述
   */
  label?: I18nData | ReactNode;
  /**
   * hover 后的展现内容
   */
  tip?: TipContent;
  /**
   * 文档链接，暂未实现
   */
  docUrl?: string;
  /**
   * 图标
   */
  icon?: IconType;
  /**
   * CSS 类
   */
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
