export interface IPublicViewFunctions {

  /** 视图初始化钩子 */
  init?: () => Promise<void>;

  /** 资源保存时，会调用视图的钩子 */
  save?: () => Promise<void>;
}

export interface IPublicEditorView {

  /** 资源名字 */
  viewName: string;

  /** 资源类型 */
  viewType?: 'editor' | 'webview';
  (ctx: any, options: any): IPublicViewFunctions;
}

export interface IPublicResourceOptions {

  /** 资源描述 */
  description?: string;

  /** 资源 icon 标识 */
  icon?: React.ReactElement;

  /** 默认视图类型 */
  defaultViewType: string;

  /** 资源视图 */
  editorViews: IPublicEditorView[];

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
}

export interface IPublicResourceData {
  resourceName: string;
  title: string;
  options: {
    [key: string]: any;
  };
}

export type IPublicResourceList = IPublicResourceData[];