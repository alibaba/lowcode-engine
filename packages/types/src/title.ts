import { ReactElement, ReactNode } from 'react';
import { I18nData } from './i18n';
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