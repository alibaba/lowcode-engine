import { makeObservable, obx, runInAction } from '@alilc/lowcode-editor-core';
import { EditorViewOptions, EditorWindow } from '@alilc/lowcode-workspace';
import { flow } from 'mobx';
import { BasicContext } from '../base-context';

export class Context extends BasicContext {
  name = 'editor-view';

  constructor(public workspace: any, public editorWindow: EditorWindow, public editorView: EditorViewOptions) {
    super(workspace, editorView.name, editorWindow);
    this.name = editorView.name;
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
    yield this.registerInnerPlugins();
    yield this.editorView?.init(this.innerPlugins._getLowCodePluginContext({
      pluginName: 'any',
    }));
    yield this.innerPlugins.init();
    this.isInit = true;
  });
}