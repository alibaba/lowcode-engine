import { makeObservable, obx } from '@alilc/lowcode-editor-core';
import { IPublicEditorViewConfig, IPublicTypeEditorView } from '@alilc/lowcode-types';
import { flow } from 'mobx';
import { Workspace as InnerWorkspace } from '../workspace';
import { BasicContext } from '../base-context';
import { EditorWindow } from '../editor-window/context';
import { getWebviewPlugin } from '../inner-plugins/webview';

export class Context extends BasicContext {
  viewName = 'editor-view';

  instance: IPublicEditorViewConfig;

  viewType: 'editor' | 'webview';

  @obx _activate = false;

  @obx isInit: boolean = false;

  init = flow(function* (this: any) {
    if (this.viewType === 'webview') {
      const url = yield this.instance?.url?.();
      yield this.plugins.register(getWebviewPlugin(url, this.viewName));
    } else {
      yield this.registerInnerPlugins();
    }
    yield this.instance?.init?.();
    yield this.innerPlugins.init();
    this.isInit = true;
  });

  constructor(public workspace: InnerWorkspace, public editorWindow: EditorWindow, public editorView: IPublicTypeEditorView, options: Object) {
    super(workspace, editorView.viewName, editorWindow);
    this.viewType = editorView.viewType || 'editor';
    this.viewName = editorView.viewName;
    this.instance = editorView(this.innerPlugins._getLowCodePluginContext({
      pluginName: 'any',
    }), options);
    makeObservable(this);
  }

  setActivate = (_activate: boolean) => {
    this._activate = _activate;
    this.innerHotkey.activate(this._activate);
  };

  get active() {
    return this._activate;
  }

  async save() {
    return await this.instance?.save?.();
  }
}