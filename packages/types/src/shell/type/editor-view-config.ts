export interface IPublicEditorViewConfig {

  /** 视图初始化钩子 */
  init?: () => Promise<void>;

  /** 资源保存时，会调用视图的钩子 */
  save?: () => Promise<void>;

  /** viewType 类型为 'webview' 时渲染的地址 */
  url?: () => Promise<string>;
}
