import { IPublicTypeNodeSchema } from '../type';

export interface IPublicModelWindow {
  /** 当前窗口导入 schema */
  importSchema(schema: IPublicTypeNodeSchema): void;

  /** 修改当前窗口视图类型 */
  changeViewType(viewName: string): void;

  /** 调用当前窗口视图保存钩子 */
  save(): Promise<any>;

  /** 窗口 id */
  id: string;

  /** 窗口标题 */
  title?: string;

  /** 窗口资源名字 */
  resourceName?: string;
}