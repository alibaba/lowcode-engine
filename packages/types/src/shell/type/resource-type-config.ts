import { IPublicTypeEditorView } from './editor-view';

export interface IPublicResourceTypeConfig {

  /** 资源描述 */
  description?: string;

  /** 资源 icon 标识 */
  icon?: React.ReactElement;

  /**
   * 默认视图类型
   * @deprecated
   */
  defaultViewType?: string;

  /** 默认视图类型 */
  defaultViewName: string;

  /** 资源视图 */
  editorViews: IPublicTypeEditorView[];

  init?: () => void;

  /** save 钩子 */
  save?: (schema: {
    [viewName: string]: any;
  }) => Promise<void>;

  /** import 钩子 */
  import?: (schema: any) => Promise<{
    [viewName: string]: any;
  }>;

  /** 默认标题 */
  defaultTitle?: string;

  /** resourceType 类型为 'webview' 时渲染的地址 */
  url?: () => Promise<string>;
}
