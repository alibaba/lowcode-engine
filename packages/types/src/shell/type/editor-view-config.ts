export interface IPublicEditorViewConfig {

  /** 视图初始化钩子 */
  init?: () => Promise<void>;

  /** 资源保存时，会调用视图的钩子 */
  save?: () => Promise<void>;
}