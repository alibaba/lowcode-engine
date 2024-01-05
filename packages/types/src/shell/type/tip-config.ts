import { IPublicTypeI18nData } from '..';
import { ReactNode } from 'react';

export interface IPublicTypeTipConfig {

  /**
   * className
   */
  className?: string;

  /**
   * tip 的内容
   */
  children?: IPublicTypeI18nData | ReactNode;
  theme?: string;

  /**
   * tip 的方向
   */
  direction?: 'top' | 'bottom' | 'left' | 'right';
}
