import { IPublicEditorViewConfig } from './editor-view-config';

export interface IPublicTypeEditorView {

  /** 资源名字 */
  viewName: string;

  /** 资源类型 */
  viewType?: 'editor' | 'webview';

  (ctx: any, options: any): IPublicEditorViewConfig;
}
