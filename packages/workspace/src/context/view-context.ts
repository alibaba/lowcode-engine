import { computed, makeObservable, obx } from '@alilc/lowcode-editor-core';
import { IPublicEditorViewConfig, IPublicTypeEditorView } from '@alilc/lowcode-types';
import { flow } from 'mobx';
import { IWorkspace } from '../workspace';
import { BasicContext } from './base-context';
import { IEditorWindow } from '../window';
import { getWebviewPlugin } from '../inner-plugins/webview';

export class Context extends BasicContext {
  viewName = 'editor-view';

  instance: IPublicEditorViewConfig;

  viewType: 'editor' | 'webview';

  @obx _activate = false;

  @obx isInit: boolean = false;

  init = flow(function* (this: Context) {
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

  constructor(public workspace: IWorkspace, public editorWindow: IEditorWindow, public editorView: IPublicTypeEditorView, options: Object | undefined) {
    super(workspace, editorView.viewName, editorWindow);
    this.viewType = editorView.viewType || 'editor';
    this.viewName = editorView.viewName;
    this.instance = editorView(this.innerPlugins._getLowCodePluginContext({
      pluginName: 'any',
    }), options);
    makeObservable(this);
  }

  @computed get active() {
    return this._activate;
  }

  onSimulatorRendererReady = (): Promise<void> => {
    return new Promise((resolve) => {
      this.project.onSimulatorRendererReady(() => {
        resolve();
      });
    });
  };

  setActivate = (_activate: boolean) => {
    this._activate = _activate;
    this.innerHotkey.activate(this._activate);
  };

  async save() {
    return await this.instance?.save?.();
  }
}