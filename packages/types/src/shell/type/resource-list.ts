import { ReactElement } from 'react';

export interface IPublicResourceData {

  /** 资源名字 */
  resourceName: string;

  /** 资源扩展配置 */
  config?: {
    [key: string]: any;
  };

  /** 资源标题 */
  title?: string;

  /** 资源 Id */
  id?: string;

  /** 分类 */
  category?: string;

  /** 资源视图 */
  viewName?: string;

  /** 资源 icon */
  icon?: ReactElement;

  /** 资源其他配置，资源初始化时的第二个参数 */
  options: {
    [key: string]: any;
  };

  /** 资源子元素 */
  children?: IPublicResourceData[];
}

export type IPublicResourceList = IPublicResourceData[];