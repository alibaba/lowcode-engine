import { ReactElement, ComponentType } from 'react';

export interface IconConfig {
  type: string;
  size?: number | 'small' | 'xxs' | 'xs' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl' | 'inherit';
  className?: string;
}

export type IconType = string | ReactElement | ComponentType<any> | IconConfig;
