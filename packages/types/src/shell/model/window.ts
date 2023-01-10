import { ReactElement } from 'react';
import { IPublicTypeNodeSchema } from '../type';
import { IPublicModelResource } from './resource';

export interface IPublicModelWindow {

  /** 窗口 id */
  id: string;

  /** 窗口标题 */
  title?: string;

  /** 窗口 icon */
  icon?: ReactElement;

  /** 窗口资源类型 */
  resource?: IPublicModelResource;

  /** 当前窗口导入 schema */
  importSchema(schema: IPublicTypeNodeSchema): void;

  /** 修改当前窗口视图类型 */
  changeViewType(viewName: string): void;

  /** 调用当前窗口视图保存钩子 */
  save(): Promise<any>;
}