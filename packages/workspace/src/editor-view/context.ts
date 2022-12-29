import { makeObservable, obx } from '@alilc/lowcode-editor-core';
import { IPublicEditorView, IPublicViewFunctions } from '@alilc/lowcode-types';
import { flow } from 'mobx';
import { Workspace as InnerWorkspace } from '../workspace';
import { BasicContext } from '../base-context';
import { EditorWindow } from '../editor-window/context';
import { getWebviewPlugin } from '../inner-plugins/webview';

export class Context extends BasicContext {
  viewName = 'editor-view';

  instance: IPublicViewFunctions;

  viewType: 'editor' | 'webview';

  constructor(public workspace: InnerWorkspace, public editorWindow: EditorWindow, public editorView: IPublicEditorView) {
    super(workspace, editorView.viewName, editorWindow);
    this.viewType = editorView.viewType || 'editor';
    this.viewName = editorView.viewName;
    this.instance = editorView(this.innerPlugins._getLowCodePluginContext({
      pluginName: 'any',
    }));
    makeObservable(this);
  }

  @obx _activate = false;

  setActivate = (_activate: boolean) => {
    this._activate = _activate;
    this.innerHotkey.activate(this._activate);
  };

  get active() {
    return this._activate;
  }

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

  async save() {
    return await this.instance?.save?.();
  }
}