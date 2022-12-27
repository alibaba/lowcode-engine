export interface IPublicViewFunctions {
  /** 视图初始化 */
  init?: () => Promise<void>;
  /** 资源保存时调用视图的钩子 */
  save?: () => Promise<void>;
}

export interface IPublicEditorView {
  /** 资源名字 */
  viewName: string;
  /** 资源类型 */
  viewType?: 'editor' | 'webview';
  (ctx: any): IPublicViewFunctions;
}

export interface IPublicResourceOptions {
  /** 资源名字 */
  name: string;

  /** 资源描述 */
  description?: string;

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
}