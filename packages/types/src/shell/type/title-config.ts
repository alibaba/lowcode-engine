import { ReactNode } from 'react';
import { IPublicTypeI18nData, IPublicTypeIconType, TipContent } from './';

/**
 * 描述 props 的 setter title
 */
export interface IPublicTypeTitleConfig {
  /**
   * 文字描述
   */
  label?: IPublicTypeI18nData | ReactNode;
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
  icon?: IPublicTypeIconType;
  /**
   * CSS 类
   */
  className?: string;
}
