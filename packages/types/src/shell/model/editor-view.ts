import { IPublicModelPluginContext } from './plugin-context';

export interface IPublicModelEditorView extends IPublicModelPluginContext {
  viewName: string;

  viewType: 'editor' | 'webview';
}