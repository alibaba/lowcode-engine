import { ReactElement } from 'react';

export interface IPublicResourceData {

  /** 资源名字 */
  resourceName: string;

  /** 资源标题 */
  title?: string;

  /** 分类 */
  category?: string;

  /** 资源视图 */
  viewName?: string;

  /** 资源 icon */
  icon?: ReactElement;

  /** 资源其他配置 */
  options: {
    [key: string]: any;
  };

  /** 资源子元素 */
  children?: IPublicResourceData[];

  config?: {
    disableBehaviors?: ('copy' | 'remove')[];
  };
}

export type IPublicResourceList = IPublicResourceData[];