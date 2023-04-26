import { ReactElement } from 'react';
import { IPublicTypeDisposable, IPublicTypeNodeSchema } from '../type';
import { IPublicModelResource } from './resource';
import { IPublicModelEditorView } from './editor-view';

export interface IPublicModelWindow<
  Resource = IPublicModelResource
> {

  /** 窗口 id */
  id: string;

  /** 窗口标题 */
  title?: string;

  /** 窗口 icon */
  icon?: ReactElement;

  /** 窗口资源类型 */
  resource?: Resource;

  /**
   * 窗口当前视图
   * @since v1.1.7
   */
  currentEditorView: IPublicModelEditorView | null;

  /**
   * 窗口全部视图实例
   * @since v1.1.7
   */
  editorViews: IPublicModelEditorView[];

  /** 当前窗口导入 schema */
  importSchema(schema: IPublicTypeNodeSchema): void;

  /** 修改当前窗口视图类型 */
  changeViewType(viewName: string): void;

  /** 调用当前窗口视图保存钩子 */
  save(): Promise<any>;

  /** 窗口视图变更事件 */
  onChangeViewType(fn: (viewName: string) => void): IPublicTypeDisposable;
}