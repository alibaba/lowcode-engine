import { IPublicModelWindow } from '../model';
import { IPublicResourceOptions } from '../type';

export interface IPublicApiWorkspace {
  /** 是否启用 workspace 模式 */
  isActive: boolean;

  /** 当前设计器窗口 */
  window: IPublicModelWindow;

  /** 注册资源 */
  registerResourceType(resourceName: string, resourceType: 'editor', options: IPublicResourceOptions): void;
}